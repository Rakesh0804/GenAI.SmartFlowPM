using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GenAI.SmartFlowPM.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixCampaignGroupRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CampaignEvaluations_Campaigns_CampaignId1",
                table: "CampaignEvaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_CampaignGroups_Campaigns_CampaignId1",
                table: "CampaignGroups");

            migrationBuilder.DropIndex(
                name: "IX_CampaignGroups_CampaignId1",
                table: "CampaignGroups");

            migrationBuilder.DropIndex(
                name: "IX_CampaignEvaluations_CampaignId1",
                table: "CampaignEvaluations");

            migrationBuilder.DropColumn(
                name: "CampaignId1",
                table: "CampaignGroups");

            migrationBuilder.DropColumn(
                name: "CampaignId1",
                table: "CampaignEvaluations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CampaignId1",
                table: "CampaignGroups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CampaignId1",
                table: "CampaignEvaluations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_CampaignGroups_CampaignId1",
                table: "CampaignGroups",
                column: "CampaignId1");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_CampaignId1",
                table: "CampaignEvaluations",
                column: "CampaignId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CampaignEvaluations_Campaigns_CampaignId1",
                table: "CampaignEvaluations",
                column: "CampaignId1",
                principalTable: "Campaigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CampaignGroups_Campaigns_CampaignId1",
                table: "CampaignGroups",
                column: "CampaignId1",
                principalTable: "Campaigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
