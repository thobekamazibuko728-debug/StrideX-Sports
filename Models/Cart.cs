
namespace StrideX.Api.Models;

public class Cart
{
    public int CartId { get; set; }

    // Identifies a visitor's cart without requiring login.
    public string CartToken { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // One cart can contain several products.
    public List<CartItem> Items { get; set; } = new();
}