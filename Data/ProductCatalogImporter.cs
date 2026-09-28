
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using StrideX.Api.Models;

namespace StrideX.Api.Data;

public static class ProductCatalogImporter
{
    public static async Task<int> ImportAsync(
        StrideXDbContext db,
        string productJsPath)
    {
        if (!File.Exists(productJsPath))
        {
            throw new FileNotFoundException(
                "The copied Data/product.js file was not found.",
                productJsPath
            );
        }

        var javascript =
            await File.ReadAllTextAsync(productJsPath);

        // Read the existing ROWS catalogue from product.js.
        // This does not execute JavaScript.
        var match = Regex.Match(
            javascript,
            @"(?ms)\bconst\s+ROWS\s*=\s*(\[.*?^\s*\]);"
        );

        if (!match.Success)
        {
            throw new InvalidOperationException(
                "Could not find the ROWS catalogue in product.js."
            );
        }

        using var catalogue = JsonDocument.Parse(
            match.Groups[1].Value,
            new JsonDocumentOptions
            {
                CommentHandling = JsonCommentHandling.Skip,
                AllowTrailingCommas = true
            }
        );

        var seenIds = new HashSet<string>();
        var sportLinks = new List<(string ProductId, int SportId)>();

        await using var transaction =
            await db.Database.BeginTransactionAsync();

        foreach (var row in catalogue.RootElement.EnumerateArray())
        {
            var id = row[0].GetString()!;
            var name = row[1].GetString()!;
            var price = row[2].GetDecimal();
            var colour = row[3].GetString();
            var type = row[4].GetString()!;

            // A product may have one image or several views.
            var photo = row[5];

            var firstImage =
                photo.ValueKind == JsonValueKind.Array
                    ? photo[0].GetString()
                    : photo.GetString();

            if (!seenIds.Add(id))
            {
                throw new InvalidOperationException(
                    "Duplicate product ID: " + id
                );
            }

            var cartCategory =
                type is "Boots" or "Tennis Shoes" or "Cycling Shoes"
                    ? "Footwear"
                    : type is
                        "Soccer Ball" or
                        "Tennis Balls" or
                        "Tennis Equipment Set" or
                        "Bicycles" or
                        "Rugby Ball" or
                        "Kicking Tee"
                    ? "Equipment"
                    : type is
                        "Jersey" or
                        "Shorts" or
                        "Socks" or
                        "Tennis Set" or
                        "Tennis Dress" or
                        "Rugby Tee" or
                        "Rugby Shorts" or
                        "Tops" or
                        "Bottoms" or
                        "Vests" or
                        "Windbreakers"
                    ? "Apparel"
                    : "Accessories";

            // Find an existing product or prepare a new one.
            var product = await db.Products.FindAsync(id);

            if (product is null)
            {
                product = new Product
                {
                    ProductId = id
                };

                db.Products.Add(product);
            }

            product.ProductName = name;
            product.Brand = id.Split('-')[0].ToUpperInvariant();
            product.Category = cartCategory + " / " + type;
            product.ProductType = type;
            product.Colour = colour;
            product.Price = price;
            product.ImagePath = firstImage;
            product.Description =
                name + ". Choose your size before adding to cart.";

            // Match the four sports already in the database:
            // 1 Soccer, 2 Rugby, 3 Tennis, 4 Cycling.
            int[] sportIds;

            if (type == "Boots")
            {
                sportIds = new[] { 1, 2 };
            }
            else if (
                id == "stridex-tennis-court-crew" ||
                id == "stridex-tennis-everyday-ankle")
            {
                sportIds = new[] { 1, 2, 3, 4 };
            }
            else if (id.Contains("-rugby-"))
            {
                sportIds = new[] { 2 };
            }
            else if (id.Contains("-tennis-"))
            {
                sportIds = new[] { 3 };
            }
            else if (id.Contains("-cycling-"))
            {
                sportIds = new[] { 4 };
            }
            else
            {
                sportIds = new[] { 1 };
            }

            foreach (var sportId in sportIds)
            {
                sportLinks.Add((id, sportId));
            }
        }

        if (seenIds.Count == 0)
        {
            throw new InvalidOperationException(
                "The catalogue contains no products."
            );
        }

        // Save products before inserting foreign-key links.
        await db.SaveChangesAsync();

        // INSERT IGNORE prevents duplicate sport links
        // if we run the importer again.
        foreach (var link in sportLinks)
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"""
                INSERT IGNORE INTO productsports
                    (ProductID, SportID)
                VALUES
                    ({link.ProductId}, {link.SportId});
                """
            );
        }

        await transaction.CommitAsync();

        return seenIds.Count;
    }
}