namespace StrideX.Api.Models;

public class CustomKitPlayer
{
    public int CustomKitPlayerId { get; set; }

    public int CustomKitOrderId { get; set; }

    public string PlayerName { get; set; } = "";

    public string PlayerNumber { get; set; } = "";

    public string Size { get; set; } = "";

    public CustomKitOrder CustomKitOrder { get; set; }
        = null!;
}