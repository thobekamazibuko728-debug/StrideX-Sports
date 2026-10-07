namespace StrideX.Api.Models;

public class ProductInventory
{
    public string ProductId { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
