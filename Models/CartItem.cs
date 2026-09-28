
namespace StrideX.Api.Models;

public class CartItem
{
    public int CartItemId { get; set; }

    // The cart containing this item.
    public int CartId { get; set; }

    // Must match a ProductID in the existing Products table.
    public string ProductId { get; set; } = string.Empty;

    // Example: "8" for boots or "M" for rugby shorts.
    public string SelectedSize { get; set; } = string.Empty;

    public int Quantity { get; set; } = 1;

    public Cart Cart { get; set; } = null!;
}