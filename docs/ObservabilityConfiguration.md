# Observability Configuration Guide

## Current Configuration

The observability system has been configured to provide comprehensive tracing in the Aspire dashboard while minimizing console noise.

## Configuration Options

### appsettings.Development.json

```json
{
  "Observability": {
    "EnableRuntimeMetrics": false,
    "EnableConsoleTracing": false
  }
}
```

### Settings Explained

1. **EnableRuntimeMetrics** (default: false)
   - Controls whether runtime metrics (GC, memory, process stats) are collected
   - Set to `true` if you need detailed performance monitoring
   - These metrics are the source of the frequent console logs you were seeing

2. **EnableConsoleTracing** (default: false)
   - Controls whether traces are logged to console
   - Set to `true` if you want to see trace details in the console
   - All traces are still sent to Aspire dashboard regardless of this setting

## What You'll See in Aspire Dashboard

✅ **Always Available:**
- HTTP request/response traces
- SQL query traces with parameters
- Custom application traces
- Error and exception details
- API call performance metrics
- Database operation metrics

⚠️ **Optional (controlled by settings):**
- Runtime metrics (GC collections, memory usage)
- Process metrics (CPU usage, thread count)
- Console trace logging

## Recommended Settings

### For Development (Clean Console)
```json
{
  "Observability": {
    "EnableRuntimeMetrics": false,
    "EnableConsoleTracing": false
  }
}
```

### For Performance Debugging
```json
{
  "Observability": {
    "EnableRuntimeMetrics": true,
    "EnableConsoleTracing": true
  }
}
```

### For Production Monitoring
```json
{
  "Observability": {
    "EnableRuntimeMetrics": true,
    "EnableConsoleTracing": false
  }
}
```

## How to Enable Specific Logging

If you want to see specific traces in console temporarily, you can:

1. Set `EnableConsoleTracing: true` in appsettings.Development.json
2. Restart your application
3. Set it back to `false` when done

## Metrics in Aspire Dashboard

Even with console metrics disabled, you'll still see all metrics in the Aspire dashboard:

- Request/response times
- Database query performance
- Error rates
- Custom business metrics
- System health metrics

The change only affects what gets logged to the console, not what gets sent to Aspire.
