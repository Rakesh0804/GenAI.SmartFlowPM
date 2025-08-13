using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Claims.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Claim;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Claims.Handlers;

public class ClaimCommandHandlers :
    IRequestHandler<CreateClaimCommand, Result<ClaimDto>>,
    IRequestHandler<UpdateClaimCommand, Result<ClaimDto>>,
    IRequestHandler<DeleteClaimCommand, Result>
{
    private readonly IClaimRepository _claimRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ClaimCommandHandlers(
        IClaimRepository claimRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _claimRepository = claimRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ClaimDto>> Handle(CreateClaimCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if claim with same name already exists
            var existingClaim = await _claimRepository.GetByNameAsync(request.CreateClaimDto.Name, cancellationToken);
            if (existingClaim != null)
            {
                return Result<ClaimDto>.Failure($"Claim with name '{request.CreateClaimDto.Name}' already exists.");
            }

            // Create new claim entity
            var claim = _mapper.Map<Claim>(request.CreateClaimDto);
            
            // Add to repository
            var createdClaim = await _claimRepository.AddAsync(claim, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Map to DTO and return
            var claimDto = _mapper.Map<ClaimDto>(createdClaim);
            return Result<ClaimDto>.Success(claimDto, "Claim created successfully.");
        }
        catch (Exception ex)
        {
            return Result<ClaimDto>.Failure($"Error creating claim: {ex.Message}");
        }
    }

    public async Task<Result<ClaimDto>> Handle(UpdateClaimCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get existing claim
            var existingClaim = await _claimRepository.GetByIdAsync(request.Id, cancellationToken);
            if (existingClaim == null)
            {
                return Result<ClaimDto>.Failure("Claim not found.");
            }

            // Check if another claim with same name exists
            var claimWithSameName = await _claimRepository.IsNameExistsAsync(
                request.UpdateClaimDto.Name, 
                request.Id, 
                cancellationToken);
            
            if (claimWithSameName)
            {
                return Result<ClaimDto>.Failure($"Another claim with name '{request.UpdateClaimDto.Name}' already exists.");
            }

            // Update claim properties
            _mapper.Map(request.UpdateClaimDto, existingClaim);
            
            // Update in repository
            var updatedClaim = await _claimRepository.UpdateAsync(existingClaim, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Map to DTO and return
            var claimDto = _mapper.Map<ClaimDto>(updatedClaim);
            return Result<ClaimDto>.Success(claimDto, "Claim updated successfully.");
        }
        catch (Exception ex)
        {
            return Result<ClaimDto>.Failure($"Error updating claim: {ex.Message}");
        }
    }

    public async Task<Result> Handle(DeleteClaimCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get existing claim
            var existingClaim = await _claimRepository.GetByIdAsync(request.Id, cancellationToken);
            if (existingClaim == null)
            {
                return Result.Failure("Claim not found.");
            }

            // Check if claim is being used by any users
            // This would need to be implemented based on your UserClaim relationship
            // For now, we'll allow deletion

            // Delete claim
            await _claimRepository.DeleteAsync(existingClaim, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success("Claim deleted successfully.");
        }
        catch (Exception ex)
        {
            return Result.Failure($"Error deleting claim: {ex.Message}");
        }
    }
}
