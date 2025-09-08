using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GenAI.SmartFlowPM.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeCampaignGroupCampaignIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Campaigns_Users_CreatedByUserId",
                table: "Campaigns");

            migrationBuilder.AlterColumn<Guid>(
                name: "CampaignId",
                table: "CampaignGroups",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Campaigns_Users_CreatedByUserId",
                table: "Campaigns",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Campaigns_Users_CreatedByUserId",
                table: "Campaigns");

            migrationBuilder.AlterColumn<Guid>(
                name: "CampaignId",
                table: "CampaignGroups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Campaigns_Users_CreatedByUserId",
                table: "Campaigns",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
