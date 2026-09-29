namespace StrideX.Api.Models;

public class Order
{
    public int OrderId { get; set; }

    public string UserId { get; set; } =
        string.Empty;

    public DateTime OrderDate { get; set; } =
        DateTime.UtcNow;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } =
        "Pending";


    // =====================================================
    // CUSTOMER / DELIVERY DETAILS
    // =====================================================

    public string CustomerName { get; set; } =
        string.Empty;

    public string CustomerEmail { get; set; } =
        string.Empty;

    public string PhoneNumber { get; set; } =
        string.Empty;

    public string StreetAddress { get; set; } =
        string.Empty;

    public string City { get; set; } =
        string.Empty;

    public string Province { get; set; } =
        string.Empty;

    public string PostalCode { get; set; } =
        string.Empty;


    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    public string PaymentMethod { get; set; } =
        "Card";

    public string PaymentLast4 { get; set; } =
        string.Empty;

    public string PaymentStatus { get; set; } =
        "Paid";


    // =====================================================
    // ORDER ITEMS
    // =====================================================

    public List<OrderItem> Items { get; set; } =
        new();
}