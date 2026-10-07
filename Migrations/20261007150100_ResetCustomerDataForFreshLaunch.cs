using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using StrideX.Api.Data;

#nullable disable

namespace StrideX.Api.Migrations
{
    [DbContext(typeof(StrideXDbContext))]
    [Migration("20261007150100_ResetCustomerDataForFreshLaunch")]
    public partial class ResetCustomerDataForFreshLaunch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove test customer transaction data first.
            migrationBuilder.Sql(
                "DELETE FROM customkitplayers;"
            );

            migrationBuilder.Sql(
                "DELETE FROM customkitorders;"
            );

            migrationBuilder.Sql(
                "DELETE FROM orderitems;"
            );

            migrationBuilder.Sql(
                "DELETE FROM orders;"
            );

            migrationBuilder.Sql(
                "DELETE FROM cartitems;"
            );

            migrationBuilder.Sql(
                "DELETE FROM carts;"
            );

            // Remove ASP.NET Identity rows that belong to customers.
            migrationBuilder.Sql(
                "DELETE FROM AspNetUserTokens;"
            );

            migrationBuilder.Sql(
                "DELETE FROM AspNetUserLogins;"
            );

            migrationBuilder.Sql(
                "DELETE FROM AspNetUserClaims;"
            );

            migrationBuilder.Sql(
                "DELETE FROM AspNetUserRoles;"
            );

            migrationBuilder.Sql(
                "DELETE FROM AspNetUsers;"
            );

            // Restore a fresh-store stock level.
            migrationBuilder.Sql(
                "UPDATE productinventory SET Quantity = 25, UpdatedAt = UTC_TIMESTAMP(6);"
            );

            // Reset numeric customer-facing IDs where supported.
            migrationBuilder.Sql(
                "ALTER TABLE customkitplayers AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE customkitorders AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE orderitems AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE orders AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE cartitems AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE carts AUTO_INCREMENT = 1;"
            );

            migrationBuilder.Sql(
                "ALTER TABLE AspNetUserClaims AUTO_INCREMENT = 1;"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Customer data cannot be restored by a rollback.
        }
    }
}
