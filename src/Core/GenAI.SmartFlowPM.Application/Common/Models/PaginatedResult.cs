using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Common.Models;

public class PaginatedResult<T>
{
    [JsonPropertyName("items")]
    public IEnumerable<T> Items { get; set; } = new List<T>();
    
    [JsonPropertyName("currentPage")]
    public int CurrentPage { get; set; }
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }
    
    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }
    
    [JsonPropertyName("totalPages")]
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    
    [JsonPropertyName("hasPreviousPage")]
    public bool HasPreviousPage => CurrentPage > 1;
    
    [JsonPropertyName("hasNextPage")]
    public bool HasNextPage => CurrentPage < TotalPages;
}

public class PagedQuery
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; } = 1;
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    
    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; set; }
    
    [JsonPropertyName("sortBy")]
    public string? SortBy { get; set; }
    
    [JsonPropertyName("sortDescending")]
    public bool SortDescending { get; set; } = false;
}
