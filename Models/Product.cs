
namespace StrideX.Api.Models;

public class Product
{
    public string ProductId { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string ProductType { get; set; } = string.Empty;

    public string? Colour { get; set; }

    public decimal Price { get; set; }

    public string? ImagePath { get; set; }

    public string? Description { get; set; }
}