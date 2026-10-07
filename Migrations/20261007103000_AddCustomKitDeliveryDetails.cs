using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrideX.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomKitDeliveryDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "customkitorders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CustomerEmail",
                table: "customkitorders",
                type: "varchar(256)",
                maxLength: 256,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "customkitorders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PaymentLast4",
                table: "customkitorders",
                type: "varchar(4)",
                maxLength: 4,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "customkitorders",
                type: "varchar(30)",
                maxLength: 30,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "customkitorders",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "customkitorders",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "customkitorders",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "StreetAddress",
                table: "customkitorders",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "City", table: "customkitorders");
            migrationBuilder.DropColumn(name: "CustomerEmail", table: "customkitorders");
            migrationBuilder.DropColumn(name: "CustomerName", table: "customkitorders");
            migrationBuilder.DropColumn(name: "PaymentLast4", table: "customkitorders");
            migrationBuilder.DropColumn(name: "PaymentStatus", table: "customkitorders");
            migrationBuilder.DropColumn(name: "PhoneNumber", table: "customkitorders");
            migrationBuilder.DropColumn(name: "PostalCode", table: "customkitorders");
            migrationBuilder.DropColumn(name: "Province", table: "customkitorders");
            migrationBuilder.DropColumn(name: "StreetAddress", table: "customkitorders");
        }
    }
}