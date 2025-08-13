using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GenAI.SmartFlowPM.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCampaignAndCertificateModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Campaigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AssignedManagers = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false, defaultValue: "[]"),
                    TargetUserIds = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false, defaultValue: "[]"),
                    ActualStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Campaigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Campaigns_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Campaigns_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CertificateTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TemplateContent = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Variables = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    StyleConfig = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    PreviewImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificateTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CertificateTemplates_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CampaignGroups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ManagerId = table.Column<Guid>(type: "uuid", nullable: false),
                    TargetUserIds = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false, defaultValue: "[]"),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CampaignId1 = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignGroups_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignGroups_Campaigns_CampaignId1",
                        column: x => x.CampaignId1,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignGroups_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignGroups_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Certificates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    RecipientId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RecipientEmail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IssuedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    IssuerName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IssuedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    VerificationToken = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    Type = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    CampaignId = table.Column<Guid>(type: "uuid", nullable: true),
                    TemplateId = table.Column<Guid>(type: "uuid", nullable: true),
                    CertificateUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CustomMessage = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    MetaData = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RevokedReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    RevokedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    VerifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    VerificationCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certificates_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Certificates_CertificateTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "CertificateTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Certificates_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Certificates_Users_IssuedBy",
                        column: x => x.IssuedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificates_Users_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificates_Users_RevokedBy",
                        column: x => x.RevokedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CampaignEvaluations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: true),
                    EvaluatedUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    EvaluatorId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleEvaluations = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ClaimEvaluations = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    Feedback = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CampaignId1 = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupId1 = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampaignEvaluations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_CampaignGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "CampaignGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_CampaignGroups_GroupId1",
                        column: x => x.GroupId1,
                        principalTable: "CampaignGroups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_Campaigns_CampaignId1",
                        column: x => x.CampaignId1,
                        principalTable: "Campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_Users_EvaluatedUserId",
                        column: x => x.EvaluatedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CampaignEvaluations_Users_EvaluatorId",
                        column: x => x.EvaluatorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_CampaignId",
                table: "CampaignEvaluations",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_CampaignId1",
                table: "CampaignEvaluations",
                column: "CampaignId1");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_EvaluatedUserId",
                table: "CampaignEvaluations",
                column: "EvaluatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_EvaluatorId",
                table: "CampaignEvaluations",
                column: "EvaluatorId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_GroupId",
                table: "CampaignEvaluations",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_GroupId1",
                table: "CampaignEvaluations",
                column: "GroupId1");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_TenantId_CampaignId_EvaluatedUserId",
                table: "CampaignEvaluations",
                columns: new[] { "TenantId", "CampaignId", "EvaluatedUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_CampaignEvaluations_Unique_Evaluation",
                table: "CampaignEvaluations",
                columns: new[] { "CampaignId", "EvaluatedUserId", "EvaluatorId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CampaignGroups_CampaignId",
                table: "CampaignGroups",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignGroups_CampaignId1",
                table: "CampaignGroups",
                column: "CampaignId1");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignGroups_ManagerId",
                table: "CampaignGroups",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignGroups_TenantId_CampaignId",
                table: "CampaignGroups",
                columns: new[] { "TenantId", "CampaignId" });

            migrationBuilder.CreateIndex(
                name: "IX_Campaigns_CreatedByUserId",
                table: "Campaigns",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Campaigns_DateRange",
                table: "Campaigns",
                columns: new[] { "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Campaigns_Status",
                table: "Campaigns",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Campaigns_TenantId_Status",
                table: "Campaigns",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_CampaignId",
                table: "Certificates",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_IssuedBy",
                table: "Certificates",
                column: "IssuedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_RecipientId",
                table: "Certificates",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_RevokedBy",
                table: "Certificates",
                column: "RevokedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_Status",
                table: "Certificates",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_TemplateId",
                table: "Certificates",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_TenantId_RecipientId",
                table: "Certificates",
                columns: new[] { "TenantId", "RecipientId" });

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_TenantId_Status",
                table: "Certificates",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_VerificationToken",
                table: "Certificates",
                column: "VerificationToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTemplates_Name",
                table: "CertificateTemplates",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTemplates_TenantId_IsActive",
                table: "CertificateTemplates",
                columns: new[] { "TenantId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTemplates_TenantId_IsDefault",
                table: "CertificateTemplates",
                columns: new[] { "TenantId", "IsDefault" });

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTemplates_Type",
                table: "CertificateTemplates",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignEvaluations");

            migrationBuilder.DropTable(
                name: "Certificates");

            migrationBuilder.DropTable(
                name: "CampaignGroups");

            migrationBuilder.DropTable(
                name: "CertificateTemplates");

            migrationBuilder.DropTable(
                name: "Campaigns");
        }
    }
}
