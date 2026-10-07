using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StrideX.Api.Models;

namespace StrideX.Api.Data;

public class StrideXDbContext
    : IdentityDbContext<ApplicationUser>
{
    public StrideXDbContext(
        DbContextOptions<StrideXDbContext> options
    ) : base(options)
    {
    }


    // =====================================================
    // DATABASE TABLES
    // =====================================================

    public DbSet<Product> Products =>
        Set<Product>();

    public DbSet<Cart> Carts =>
        Set<Cart>();

    public DbSet<CartItem> CartItems =>
        Set<CartItem>();

    public DbSet<Order> Orders =>
        Set<Order>();

    public DbSet<OrderItem> OrderItems =>
        Set<OrderItem>();
        public DbSet<CustomKitOrder> CustomKitOrders
    => Set<CustomKitOrder>();

public DbSet<CustomKitPlayer> CustomKitPlayers
    => Set<CustomKitPlayer>();


    // =====================================================
    // DATABASE CONFIGURATION
    // =====================================================

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        // Configure ASP.NET Core Identity tables.
        base.OnModelCreating(modelBuilder);


        // =================================================
        // EXISTING PRODUCTS TABLE
        // =================================================
        //
        // The products table already existed before
        // EF Core migrations were added.
        //
        // ExcludeFromMigrations prevents EF Core from
        // trying to create it again.
        // =================================================

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable(
                "products",
                table =>
                    table.ExcludeFromMigrations()
            );


            entity.HasKey(
                p => p.ProductId
            );


            entity.Property(
                p => p.ProductId
            )
            .HasColumnName("ProductID")
            .HasMaxLength(120);


            entity.Property(
                p => p.ProductName
            )
            .HasColumnName("ProductName")
            .HasMaxLength(200)
            .IsRequired();


            entity.Property(
                p => p.Brand
            )
            .HasColumnName("Brand")
            .HasMaxLength(60)
            .IsRequired();


            entity.Property(
                p => p.Category
            )
            .HasColumnName("Category")
            .HasMaxLength(80)
            .IsRequired();


            entity.Property(
                p => p.ProductType
            )
            .HasColumnName("ProductType")
            .HasMaxLength(80)
            .IsRequired();


            entity.Property(
                p => p.Colour
            )
            .HasColumnName("Colour")
            .HasMaxLength(100);


            entity.Property(
                p => p.Price
            )
            .HasColumnName("Price")
            .HasPrecision(10, 2);


            entity.Property(
                p => p.ImagePath
            )
            .HasColumnName("ImagePath")
            .HasMaxLength(500);


            entity.Property(
                p => p.Description
            )
            .HasColumnName("Description")
            .HasColumnType("text");
        });


        // =================================================
        // CARTS TABLE
        // =================================================

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.ToTable(
                "carts"
            );


            entity.HasKey(
                c => c.CartId
            );


            entity.Property(
                c => c.CartId
            )
            .HasColumnName("CartID")
            .ValueGeneratedOnAdd();


            entity.Property(
                c => c.CartToken
            )
            .HasColumnName("CartToken")
            .HasMaxLength(36)
            .IsRequired();


            entity.HasIndex(
                c => c.CartToken
            )
            .IsUnique();


            entity.Property(
                c => c.CreatedAt
            )
            .HasColumnName("CreatedAt");


            entity.Property(
                c => c.UpdatedAt
            )
            .HasColumnName("UpdatedAt");


            entity.HasMany(
                c => c.Items
            )
            .WithOne(
                i => i.Cart
            )
            .HasForeignKey(
                i => i.CartId
            )
            .OnDelete(
                DeleteBehavior.Cascade
            );
        });



        // =================================================
        // CART ITEMS TABLE
        // =================================================

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable(
                "cartitems"
            );


            entity.HasKey(
                i => i.CartItemId
            );


            entity.Property(
                i => i.CartItemId
            )
            .HasColumnName("CartItemID")
            .ValueGeneratedOnAdd();


            entity.Property(
                i => i.CartId
            )
            .HasColumnName("CartID");


            entity.Property(
                i => i.ProductId
            )
            .HasColumnName("ProductID")
            .HasMaxLength(120)
            .IsRequired();


            entity.Property(
                i => i.SelectedSize
            )
            .HasColumnName("SelectedSize")
            .HasMaxLength(20)
            .IsRequired();


            entity.Property(
                i => i.Quantity
            )
            .HasColumnName("Quantity")
            .IsRequired();


            // One product and size combination
            // should appear only once in a cart.

            entity.HasIndex(
                i => new
                {
                    i.CartId,
                    i.ProductId,
                    i.SelectedSize
                }
            )
            .IsUnique();


            // Cart items must reference
            // a real StrideX product.

            entity.HasOne<Product>()
                .WithMany()
                .HasForeignKey(
                    i => i.ProductId
                )
                .OnDelete(
                    DeleteBehavior.Restrict
                );
        });


        // =================================================
        // ORDERS TABLE
        // =================================================

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable(
                "orders"
            );


            entity.HasKey(
                o => o.OrderId
            );


            entity.Property(
                o => o.OrderId
            )
            .HasColumnName("OrderID")
            .ValueGeneratedOnAdd();


            entity.Property(
                o => o.UserId
            )
            .HasColumnName("UserID")
            .HasMaxLength(255)
            .IsRequired();


            entity.Property(
                o => o.OrderDate
            )
            .HasColumnName("OrderDate");


            entity.Property(
                o => o.TotalAmount
            )
            .HasColumnName("TotalAmount")
            .HasPrecision(10, 2);


            entity.Property(
                o => o.Status
            )
            .HasColumnName("Status")
            .HasMaxLength(30)
            .IsRequired();


            // Makes it quicker to find
            // all orders belonging to one customer.

            entity.HasIndex(
                o => o.UserId
            );


            // One order can contain
            // several order items.

            entity.HasMany(
                o => o.Items
            )
            .WithOne(
                i => i.Order
            )
            .HasForeignKey(
                i => i.OrderId
            )
            .OnDelete(
                DeleteBehavior.Cascade
            );
        });


        // =================================================
        // ORDER ITEMS TABLE
        // =================================================

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable(
                "orderitems"
            );


            entity.HasKey(
                i => i.OrderItemId
            );


            entity.Property(
                i => i.OrderItemId
            )
            .HasColumnName("OrderItemID")
            .ValueGeneratedOnAdd();


            entity.Property(
                i => i.OrderId
            )
            .HasColumnName("OrderID");


            entity.Property(
                i => i.ProductId
            )
            .HasColumnName("ProductID")
            .HasMaxLength(120)
            .IsRequired();


            entity.Property(
                i => i.ProductName
            )
            .HasColumnName("ProductName")
            .HasMaxLength(200)
            .IsRequired();


            entity.Property(
                i => i.SelectedSize
            )
            .HasColumnName("SelectedSize")
            .HasMaxLength(20)
            .IsRequired();


            entity.Property(
                i => i.Quantity
            )
            .HasColumnName("Quantity")
            .IsRequired();


            entity.Property(
                i => i.UnitPrice
            )
            .HasColumnName("UnitPrice")
            .HasPrecision(10, 2);


            entity.Property(
                i => i.LineTotal
            )
            .HasColumnName("LineTotal")
            .HasPrecision(10, 2);


            entity.HasIndex(
                i => i.OrderId
            );
        });
        // =================================================
// CUSTOM KIT ORDERS TABLE
// =================================================

modelBuilder.Entity<CustomKitOrder>(entity =>
{
    entity.ToTable(
        "customkitorders"
    );


    entity.HasKey(
        k => k.CustomKitOrderId
    );


    entity.Property(
        k => k.CustomKitOrderId
    )
    .HasColumnName("CustomKitOrderID")
    .ValueGeneratedOnAdd();


    entity.Property(
        k => k.UserId
    )
    .HasColumnName("UserID")
    .HasMaxLength(255)
    .IsRequired();


    entity.Property(
        k => k.Sport
    )
    .HasColumnName("Sport")
    .HasMaxLength(30)
    .IsRequired();


    entity.Property(
        k => k.Garment
    )
    .HasColumnName("Garment")
    .HasMaxLength(100)
    .IsRequired();


    entity.Property(
        k => k.Template
    )
    .HasColumnName("Template")
    .HasMaxLength(50)
    .IsRequired();


    entity.Property(
        k => k.PrimaryColour
    )
    .HasColumnName("PrimaryColour")
    .HasMaxLength(20)
    .IsRequired();


    entity.Property(
        k => k.SecondaryColour
    )
    .HasColumnName("SecondaryColour")
    .HasMaxLength(20)
    .IsRequired();


    entity.Property(
        k => k.AccentColour
    )
    .HasColumnName("AccentColour")
    .HasMaxLength(20)
    .IsRequired();


    entity.Property(
        k => k.TeamName
    )
    .HasColumnName("TeamName")
    .HasMaxLength(100)
    .IsRequired();


    entity.Property(
        k => k.CrestData
    )
    .HasColumnName("CrestData")
    .HasColumnType("longtext");


    entity.Property(
        k => k.Quantity
    )
    .HasColumnName("Quantity")
    .IsRequired();


    entity.Property(
        k => k.PricePerKit
    )
    .HasColumnName("PricePerKit")
    .HasPrecision(10, 2);


    entity.Property(
        k => k.EstimatedTotal
    )
    .HasColumnName("EstimatedTotal")
    .HasPrecision(10, 2);


    entity.Property(k => k.CustomerName)
        .HasColumnName("CustomerName")
        .HasMaxLength(100);

    entity.Property(k => k.CustomerEmail)
        .HasColumnName("CustomerEmail")
        .HasMaxLength(256);

    entity.Property(k => k.PhoneNumber)
        .HasColumnName("PhoneNumber")
        .HasMaxLength(20);

    entity.Property(k => k.StreetAddress)
        .HasColumnName("StreetAddress")
        .HasMaxLength(200);

    entity.Property(k => k.City)
        .HasColumnName("City")
        .HasMaxLength(100);

    entity.Property(k => k.Province)
        .HasColumnName("Province")
        .HasMaxLength(100);

    entity.Property(k => k.PostalCode)
        .HasColumnName("PostalCode")
        .HasMaxLength(10);

    entity.Property(k => k.PaymentLast4)
        .HasColumnName("PaymentLast4")
        .HasMaxLength(4);

    entity.Property(k => k.PaymentStatus)
        .HasColumnName("PaymentStatus")
        .HasMaxLength(30);


    entity.Property(
        k => k.Status
    )
    .HasColumnName("Status")
    .HasMaxLength(30)
    .IsRequired();


    entity.Property(
        k => k.CreatedAt
    )
    .HasColumnName("CreatedAt");


    entity.HasIndex(
        k => k.UserId
    );


    entity.HasMany(
        k => k.Players
    )
    .WithOne(
        p => p.CustomKitOrder
    )
    .HasForeignKey(
        p => p.CustomKitOrderId
    )
    .OnDelete(
        DeleteBehavior.Cascade
    );
});


// =================================================
// CUSTOM KIT PLAYERS TABLE
// =================================================

modelBuilder.Entity<CustomKitPlayer>(entity =>
{
    entity.ToTable(
        "customkitplayers"
    );


    entity.HasKey(
        p => p.CustomKitPlayerId
    );


    entity.Property(
        p => p.CustomKitPlayerId
    )
    .HasColumnName("CustomKitPlayerID")
    .ValueGeneratedOnAdd();


    entity.Property(
        p => p.CustomKitOrderId
    )
    .HasColumnName("CustomKitOrderID");


    entity.Property(
        p => p.PlayerName
    )
    .HasColumnName("PlayerName")
    .HasMaxLength(100)
    .IsRequired();


    entity.Property(
        p => p.PlayerNumber
    )
    .HasColumnName("PlayerNumber")
    .HasMaxLength(10)
    .IsRequired();


    entity.Property(
        p => p.Size
    )
    .HasColumnName("Size")
    .HasMaxLength(20)
    .IsRequired();


    entity.HasIndex(
        p => p.CustomKitOrderId
    );
});
    }
}