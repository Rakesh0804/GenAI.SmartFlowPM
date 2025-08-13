using GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs;
using MediatR;
using System;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.Queries
{
    public class GetHomeDashboardQuery : IRequest<HomeDashboardDto>
    {
        public Guid UserId { get; set; }

        public GetHomeDashboardQuery(Guid userId)
        {
            UserId = userId;
        }

        public GetHomeDashboardQuery() { }
    }
}
