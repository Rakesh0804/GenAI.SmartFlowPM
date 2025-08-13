using GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.Queries
{
    public class GetHomeDashboardQuery : IRequest<HomeDashboardDto>
    {
        // You can add user/tenant context here if needed
    }
}
