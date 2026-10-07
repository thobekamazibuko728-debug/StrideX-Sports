using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using StrideX.Api.Data;

#nullable disable

namespace StrideX.Api.Migrations
{
    [DbContext(typeof(StrideXDbContext))]
    [Migration("20261007174500_AddCustomKitFulfilment")]
    public partial class AddCustomKitFulfilment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FulfilmentMethod",
                table: "customkitorders",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true
            )
            .Annotation(
                "MySql:CharSet",
                "utf8mb4"
            );

            migrationBuilder.AddColumn<decimal>(
                name: "FulfilmentFee",
                table: "customkitorders",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FulfilmentMethod",
                table: "customkitorders"
            );

            migrationBuilder.DropColumn(
                name: "FulfilmentFee",
                table: "customkitorders"
            );
        }
    }
}
