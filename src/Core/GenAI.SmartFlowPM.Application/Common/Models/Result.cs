using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Common.Models;

public class Result<T>
{
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; set; }
    
    [JsonPropertyName("data")]
    public T? Data { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    
    [JsonPropertyName("errors")]
    public IEnumerable<string>? Errors { get; set; }

    public static Result<T> Success(T data, string? message = null)
    {
        return new Result<T>
        {
            IsSuccess = true,
            Data = data,
            Message = message
        };
    }

    public static Result<T> Failure(string error)
    {
        return new Result<T>
        {
            IsSuccess = false,
            Errors = new[] { error }
        };
    }

    public static Result<T> Failure(IEnumerable<string> errors)
    {
        return new Result<T>
        {
            IsSuccess = false,
            Errors = errors
        };
    }
}

public class Result
{
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    
    [JsonPropertyName("errors")]
    public IEnumerable<string>? Errors { get; set; }

    public static Result Success(string? message = null)
    {
        return new Result
        {
            IsSuccess = true,
            Message = message
        };
    }

    public static Result Failure(string error)
    {
        return new Result
        {
            IsSuccess = false,
            Errors = new[] { error }
        };
    }

    public static Result Failure(IEnumerable<string> errors)
    {
        return new Result
        {
            IsSuccess = false,
            Errors = errors
        };
    }
}
