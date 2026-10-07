using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using StrideX.Api.Data;

#nullable disable

namespace StrideX.Api.Migrations
{
    [DbContext(typeof(StrideXDbContext))]
    [Migration("20261007120000_AddProductInventory")]
    public partial class AddProductInventory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "productinventory",
                columns: table => new
                {
                    ProductID = table.Column<string>(
                        type: "varchar(120)",
                        maxLength: 120,
                        nullable: false
                    )
                    .Annotation("MySql:CharSet", "utf8mb4"),

                    Quantity = table.Column<int>(
                        type: "int",
                        nullable: false
                    ),

                    UpdatedAt = table.Column<DateTime>(
                        type: "datetime(6)",
                        nullable: false
                    )
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_productinventory",
                        x => x.ProductID
                    );
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql(
                @"INSERT INTO productinventory (ProductID, Quantity, UpdatedAt)
                  SELECT p.ProductID, 25, UTC_TIMESTAMP(6)
                  FROM products AS p
                  WHERE NOT EXISTS (
                      SELECT 1
                      FROM productinventory AS i
                      WHERE i.ProductID = p.ProductID
                  );"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "productinventory"
            );
        }
    }
}
