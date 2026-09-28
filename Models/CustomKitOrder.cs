namespace StrideX.Api.Models;

public class CustomKitOrder
{
    public int CustomKitOrderId { get; set; }

    public string UserId { get; set; } = "";

    public string Sport { get; set; } = "";

    public string Garment { get; set; } = "";

    public string Template { get; set; } = "";

    public string PrimaryColour { get; set; } = "";

    public string SecondaryColour { get; set; } = "";

    public string AccentColour { get; set; } = "";

    public string TeamName { get; set; } = "";

    public string? CrestData { get; set; }

    public int Quantity { get; set; }

    public decimal PricePerKit { get; set; }

    public decimal EstimatedTotal { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }

    public ICollection<CustomKitPlayer> Players { get; set; }
        = new List<CustomKitPlayer>();
}