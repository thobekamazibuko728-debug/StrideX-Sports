namespace StrideX.Api.Models;

public class Order
{
    public int OrderId { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } =
        DateTime.UtcNow;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } =
        "Pending";

    public List<OrderItem> Items { get; set; } =
        new();
}