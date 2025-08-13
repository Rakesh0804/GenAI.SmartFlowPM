using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Organization;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Organizations.Commands;

public class CreateOrganizationCommand : IRequest<Result<OrganizationDto>>
{
    [JsonPropertyName("createOrganizationDto")]
    public CreateOrganizationDto CreateOrganizationDto { get; set; } = null!;
}

public class UpdateOrganizationCommand : IRequest<Result<OrganizationDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateOrganizationDto")]
    public UpdateOrganizationDto UpdateOrganizationDto { get; set; } = null!;
}

public class CreateBranchCommand : IRequest<Result<BranchDto>>
{
    [JsonPropertyName("createBranchDto")]
    public CreateBranchDto CreateBranchDto { get; set; } = null!;
}

public class UpdateBranchCommand : IRequest<Result<BranchDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateBranchDto")]
    public UpdateBranchDto UpdateBranchDto { get; set; } = null!;
}

public class DeleteBranchCommand : IRequest<Result<Unit>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
