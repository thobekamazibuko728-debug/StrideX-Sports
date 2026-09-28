namespace StrideX.Api.Models;

public class OrderItem
{
    public int OrderItemId { get; set; }

    public int OrderId { get; set; }

    public string ProductId { get; set; } =
        string.Empty;

    public string ProductName { get; set; } =
        string.Empty;

    public string SelectedSize { get; set; } =
        string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal LineTotal { get; set; }

    public Order Order { get; set; } =
        null!;
}