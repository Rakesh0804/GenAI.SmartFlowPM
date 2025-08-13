using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Organization;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Features.Organizations.Queries;
using GenAI.SmartFlowPM.Domain.Interfaces;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Organizations.Handlers;

public class GetOrganizationDetailsQueryHandler : IRequestHandler<GetOrganizationDetailsQuery, Result<OrganizationDto>>
{
    private readonly IOrganizationRepository _organizationRepository;

    public GetOrganizationDetailsQueryHandler(IOrganizationRepository organizationRepository)
    {
        _organizationRepository = organizationRepository;
    }

    public async Task<Result<OrganizationDto>> Handle(GetOrganizationDetailsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var organization = await _organizationRepository.GetByIdAsync(request.Id, cancellationToken);
            if (organization == null)
            {
                return Result<OrganizationDto>.Failure("Organization not found.");
            }

            var organizationDto = new OrganizationDto
            {
                Id = organization.Id,
                Name = organization.Name,
                Description = organization.Description,
                Website = organization.Website,
                Phone = organization.Phone,
                Email = organization.Email,
                Address = organization.Address,
                City = organization.City,
                State = organization.State,
                Country = organization.Country,
                ZipCode = organization.PostalCode,
                LogoUrl = organization.Logo,
                EstablishedDate = organization.EstablishedDate.HasValue ? DateOnly.FromDateTime(organization.EstablishedDate.Value) : null,
                Industry = null, // Add industry to Organization entity if needed
                IsActive = organization.IsActive,
                CreatedAt = organization.CreatedAt,
                UpdatedAt = organization.UpdatedAt ?? DateTime.UtcNow
            };

            return Result<OrganizationDto>.Success(organizationDto);
        }
        catch (Exception)
        {
            return Result<OrganizationDto>.Failure("An error occurred while retrieving organization details.");
        }
    }
}

public class GetOrganizationWithBranchesQueryHandler : IRequestHandler<GetOrganizationWithBranchesQuery, Result<OrganizationWithBranchesDto>>
{
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IUserRepository _userRepository;

    public GetOrganizationWithBranchesQueryHandler(
        IOrganizationRepository organizationRepository,
        IBranchRepository branchRepository,
        IUserRepository userRepository)
    {
        _organizationRepository = organizationRepository;
        _branchRepository = branchRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<OrganizationWithBranchesDto>> Handle(GetOrganizationWithBranchesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var organization = await _organizationRepository.GetByIdAsync(request.Id, cancellationToken);
            if (organization == null)
            {
                return Result<OrganizationWithBranchesDto>.Failure("Organization not found.");
            }

            var branches = await _branchRepository.GetByOrganizationIdAsync(request.Id, cancellationToken);
            
            var branchDtos = new List<BranchWithManagerDto>();
            foreach (var branch in branches)
            {
                var branchDto = new BranchWithManagerDto
                {
                    Id = branch.Id,
                    OrganizationId = branch.OrganizationId,
                    Name = branch.Name,
                    Code = branch.Code,
                    BranchType = branch.BranchType,
                    Description = branch.Description,
                    Phone = branch.Phone,
                    Email = branch.Email,
                    Address = branch.Address,
                    City = branch.City,
                    State = branch.State,
                    Country = branch.Country,
                    PostalCode = branch.PostalCode,
                    ManagerId = branch.ManagerId,
                    IsActive = branch.IsActive,
                    CreatedAt = branch.CreatedAt,
                    UpdatedAt = branch.UpdatedAt ?? DateTime.UtcNow
                };

                if (branch.ManagerId.HasValue)
                {
                    var manager = await _userRepository.GetByIdAsync(branch.ManagerId.Value, cancellationToken);
                    if (manager != null)
                    {
                        branchDto.Manager = new UserSummaryDto
                        {
                            Id = manager.Id,
                            FirstName = manager.FirstName,
                            LastName = manager.LastName,
                            Email = manager.Email,
                            Username = manager.UserName
                        };
                    }
                }

                branchDtos.Add(branchDto);
            }

            var result = new OrganizationWithBranchesDto
            {
                Id = organization.Id,
                Name = organization.Name,
                Description = organization.Description,
                Website = organization.Website,
                Phone = organization.Phone,
                Email = organization.Email,
                Address = organization.Address,
                City = organization.City,
                State = organization.State,
                Country = organization.Country,
                ZipCode = organization.PostalCode,
                LogoUrl = organization.Logo,
                EstablishedDate = organization.EstablishedDate.HasValue ? DateOnly.FromDateTime(organization.EstablishedDate.Value) : null,
                Industry = null, // Add industry to Organization entity if needed
                IsActive = organization.IsActive,
                CreatedAt = organization.CreatedAt,
                UpdatedAt = organization.UpdatedAt ?? DateTime.UtcNow,
                Branches = branchDtos
            };

            return Result<OrganizationWithBranchesDto>.Success(result);
        }
        catch (Exception)
        {
            return Result<OrganizationWithBranchesDto>.Failure("An error occurred while retrieving organization with branches.");
        }
    }
}

public class GetAllBranchesQueryHandler : IRequestHandler<GetAllBranchesQuery, Result<PaginatedResult<BranchDto>>>
{
    private readonly IBranchRepository _branchRepository;

    public GetAllBranchesQueryHandler(IBranchRepository branchRepository)
    {
        _branchRepository = branchRepository;
    }

    public async Task<Result<PaginatedResult<BranchDto>>> Handle(GetAllBranchesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var organizationId = request.OrganizationId ?? Guid.Empty;
            if (organizationId == Guid.Empty)
            {
                return Result<PaginatedResult<BranchDto>>.Failure("Organization ID is required.");
            }

            var branches = await _branchRepository.GetByOrganizationIdAsync(organizationId, cancellationToken);
            
            var branchDtos = new List<BranchDto>();
            foreach (var branch in branches)
            {
                var branchDto = new BranchDto
                {
                    Id = branch.Id,
                    OrganizationId = branch.OrganizationId,
                    Name = branch.Name,
                    Code = branch.Code,
                    BranchType = branch.BranchType,
                    Description = branch.Description,
                    Phone = branch.Phone,
                    Email = branch.Email,
                    Address = branch.Address,
                    City = branch.City,
                    State = branch.State,
                    Country = branch.Country,
                    PostalCode = branch.PostalCode,
                    ManagerId = branch.ManagerId,
                    IsActive = branch.IsActive,
                    CreatedAt = branch.CreatedAt,
                    UpdatedAt = branch.UpdatedAt ?? DateTime.UtcNow
                };

                branchDtos.Add(branchDto);
            }

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(request.PagedQuery.SearchTerm))
            {
                branchDtos = branchDtos.Where(b => 
                    b.Name.Contains(request.PagedQuery.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                    (b.Code?.Contains(request.PagedQuery.SearchTerm, StringComparison.OrdinalIgnoreCase) ?? false) ||
                    (b.City?.Contains(request.PagedQuery.SearchTerm, StringComparison.OrdinalIgnoreCase) ?? false)
                ).ToList();
            }

            // Apply pagination
            var totalCount = branchDtos.Count;
            var pagedBranches = branchDtos
                .Skip((request.PagedQuery.PageNumber - 1) * request.PagedQuery.PageSize)
                .Take(request.PagedQuery.PageSize)
                .ToList();

            var result = new PaginatedResult<BranchDto>
            {
                Items = pagedBranches,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<BranchDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<PaginatedResult<BranchDto>>.Failure("An error occurred while retrieving branches.");
        }
    }
}

public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, Result<BranchDto>>
{
    private readonly IBranchRepository _branchRepository;

    public GetBranchByIdQueryHandler(IBranchRepository branchRepository)
    {
        _branchRepository = branchRepository;
    }

    public async Task<Result<BranchDto>> Handle(GetBranchByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var branch = await _branchRepository.GetByIdAsync(request.Id, cancellationToken);
            if (branch == null)
            {
                return Result<BranchDto>.Failure("Branch not found.");
            }

            var branchDto = new BranchDto
            {
                Id = branch.Id,
                OrganizationId = branch.OrganizationId,
                Name = branch.Name,
                Code = branch.Code,
                BranchType = branch.BranchType,
                Description = branch.Description,
                Phone = branch.Phone,
                Email = branch.Email,
                Address = branch.Address,
                City = branch.City,
                State = branch.State,
                Country = branch.Country,
                PostalCode = branch.PostalCode,
                ManagerId = branch.ManagerId,
                IsActive = branch.IsActive,
                CreatedAt = branch.CreatedAt,
                UpdatedAt = branch.UpdatedAt ?? DateTime.UtcNow
            };

            return Result<BranchDto>.Success(branchDto);
        }
        catch (Exception)
        {
            return Result<BranchDto>.Failure("An error occurred while retrieving branch details.");
        }
    }
}

public class GetAllOrganizationsQueryHandler : IRequestHandler<GetAllOrganizationsQuery, Result<PaginatedResult<OrganizationDto>>>
{
    private readonly IOrganizationRepository _organizationRepository;

    public GetAllOrganizationsQueryHandler(IOrganizationRepository organizationRepository)
    {
        _organizationRepository = organizationRepository;
    }

    public async Task<Result<PaginatedResult<OrganizationDto>>> Handle(GetAllOrganizationsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (organizations, totalCount) = await _organizationRepository.GetPagedAsync(
                request.PagedQuery.PageNumber,
                request.PagedQuery.PageSize,
                predicate: null, // Get all organizations
                orderBy: x => x.Name,
                ascending: true,
                cancellationToken);

            var organizationDtos = organizations.Select(org => new OrganizationDto
            {
                Id = org.Id,
                Name = org.Name,
                Description = org.Description,
                Website = org.Website,
                Phone = org.Phone,
                Email = org.Email,
                Address = org.Address,
                City = org.City,
                State = org.State,
                Country = org.Country,
                ZipCode = org.PostalCode,
                LogoUrl = org.Logo,
                EstablishedDate = org.EstablishedDate.HasValue ? DateOnly.FromDateTime(org.EstablishedDate.Value) : null,
                Industry = null, // Add industry to Organization entity if needed
                IsActive = org.IsActive,
                CreatedAt = org.CreatedAt,
                UpdatedAt = org.UpdatedAt ?? DateTime.UtcNow
            }).ToList();

            var paginatedResult = new PaginatedResult<OrganizationDto>
            {
                Items = organizationDtos,
                TotalCount = totalCount,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize
            };

            return Result<PaginatedResult<OrganizationDto>>.Success(paginatedResult);
        }
        catch (Exception)
        {
            return Result<PaginatedResult<OrganizationDto>>.Failure("An error occurred while retrieving organizations.");
        }
    }
}

public class GetAllOrganizationsWithBranchesQueryHandler : IRequestHandler<GetAllOrganizationsWithBranchesQuery, Result<PaginatedResult<OrganizationWithBranchesDto>>>
{
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IUserRepository _userRepository;

    public GetAllOrganizationsWithBranchesQueryHandler(
        IOrganizationRepository organizationRepository,
        IBranchRepository branchRepository,
        IUserRepository userRepository)
    {
        _organizationRepository = organizationRepository;
        _branchRepository = branchRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<PaginatedResult<OrganizationWithBranchesDto>>> Handle(GetAllOrganizationsWithBranchesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (organizations, totalCount) = await _organizationRepository.GetPagedAsync(
                request.PagedQuery.PageNumber,
                request.PagedQuery.PageSize,
                predicate: null, // Get all organizations
                orderBy: x => x.Name,
                ascending: true,
                cancellationToken);

            var organizationWithBranchesDtos = new List<OrganizationWithBranchesDto>();

            foreach (var organization in organizations)
            {
                var branches = await _branchRepository.GetByOrganizationIdAsync(organization.Id, cancellationToken);
                
                var branchDtos = new List<BranchWithManagerDto>();
                foreach (var branch in branches)
                {
                    var branchDto = new BranchWithManagerDto
                    {
                        Id = branch.Id,
                        OrganizationId = branch.OrganizationId,
                        Name = branch.Name,
                        Code = branch.Code,
                        BranchType = branch.BranchType,
                        Description = branch.Description,
                        Phone = branch.Phone,
                        Email = branch.Email,
                        Address = branch.Address,
                        City = branch.City,
                        State = branch.State,
                        Country = branch.Country,
                        PostalCode = branch.PostalCode,
                        ManagerId = branch.ManagerId,
                        IsActive = branch.IsActive,
                        CreatedAt = branch.CreatedAt,
                        UpdatedAt = branch.UpdatedAt ?? DateTime.UtcNow
                    };

                    if (branch.ManagerId.HasValue)
                    {
                        var manager = await _userRepository.GetByIdAsync(branch.ManagerId.Value, cancellationToken);
                        if (manager != null)
                        {
                            branchDto.Manager = new UserSummaryDto
                            {
                                Id = manager.Id,
                                FirstName = manager.FirstName,
                                LastName = manager.LastName,
                                Email = manager.Email,
                                Username = manager.UserName
                            };
                        }
                    }

                    branchDtos.Add(branchDto);
                }

                var organizationDto = new OrganizationWithBranchesDto
                {
                    Id = organization.Id,
                    Name = organization.Name,
                    Description = organization.Description,
                    Website = organization.Website,
                    Phone = organization.Phone,
                    Email = organization.Email,
                    Address = organization.Address,
                    City = organization.City,
                    State = organization.State,
                    Country = organization.Country,
                    ZipCode = organization.PostalCode,
                    LogoUrl = organization.Logo,
                    EstablishedDate = organization.EstablishedDate.HasValue ? DateOnly.FromDateTime(organization.EstablishedDate.Value) : null,
                    Industry = null, // Add industry to Organization entity if needed
                    IsActive = organization.IsActive,
                    CreatedAt = organization.CreatedAt,
                    UpdatedAt = organization.UpdatedAt ?? DateTime.UtcNow,
                    Branches = branchDtos
                };

                organizationWithBranchesDtos.Add(organizationDto);
            }

            var paginatedResult = new PaginatedResult<OrganizationWithBranchesDto>
            {
                Items = organizationWithBranchesDtos,
                TotalCount = totalCount,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize
            };

            return Result<PaginatedResult<OrganizationWithBranchesDto>>.Success(paginatedResult);
        }
        catch (Exception)
        {
            return Result<PaginatedResult<OrganizationWithBranchesDto>>.Failure("An error occurred while retrieving organizations with branches.");
        }
    }
}
