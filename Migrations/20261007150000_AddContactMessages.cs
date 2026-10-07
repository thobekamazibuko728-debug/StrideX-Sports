using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using StrideX.Api.Data;

#nullable disable

namespace StrideX.Api.Migrations
{
    [DbContext(typeof(StrideXDbContext))]
    [Migration("20261007150000_AddContactMessages")]
    public partial class AddContactMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "contactmessages",
                columns: table => new
                {
                    ContactMessageID =
                        table.Column<int>(
                            type: "int",
                            nullable: false
                        )
                        .Annotation(
                            "MySql:ValueGenerationStrategy",
                            MySqlValueGenerationStrategy.IdentityColumn
                        ),

                    FullName =
                        table.Column<string>(
                            type: "varchar(100)",
                            maxLength: 100,
                            nullable: false
                        )
                        .Annotation(
                            "MySql:CharSet",
                            "utf8mb4"
                        ),

                    Email =
                        table.Column<string>(
                            type: "varchar(256)",
                            maxLength: 256,
                            nullable: false
                        )
                        .Annotation(
                            "MySql:CharSet",
                            "utf8mb4"
                        ),

                    Subject =
                        table.Column<string>(
                            type: "varchar(150)",
                            maxLength: 150,
                            nullable: false
                        )
                        .Annotation(
                            "MySql:CharSet",
                            "utf8mb4"
                        ),

                    Message =
                        table.Column<string>(
                            type: "text",
                            nullable: false
                        )
                        .Annotation(
                            "MySql:CharSet",
                            "utf8mb4"
                        ),

                    Status =
                        table.Column<string>(
                            type: "varchar(30)",
                            maxLength: 30,
                            nullable: false
                        )
                        .Annotation(
                            "MySql:CharSet",
                            "utf8mb4"
                        ),

                    CreatedAt =
                        table.Column<DateTime>(
                            type: "datetime(6)",
                            nullable: false
                        )
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_contactmessages",
                        x => x.ContactMessageID
                    );
                })
                .Annotation(
                    "MySql:CharSet",
                    "utf8mb4"
                );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "contactmessages"
            );
        }
    }
}
