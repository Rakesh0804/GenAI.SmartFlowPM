using System.Reflection;
using FluentValidation;
using GenAI.SmartFlowPM.Application.Common.Mappings;
using Microsoft.Extensions.DependencyInjection;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add MediatR
        services.AddMediatR(Assembly.GetExecutingAssembly());

        // Add AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // Add FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
