# PowerShell script to fix dropdown and remaining blue/purple colors
Write-Host "Fixing dropdown and remaining color issues..." -ForegroundColor Green

# Define the file patterns to search
$filePatterns = @(
    "src/**/*.tsx",
    "src/**/*.ts",
    "src/**/*.jsx",
    "src/**/*.js"
)

# Define color mappings for remaining blue/purple colors
$colorMappings = @{
    # Blue colors
    "bg-blue-50" = "bg-primary-50"
    "bg-blue-100" = "bg-primary-100"
    "bg-blue-500" = "bg-primary-500"
    "bg-blue-600" = "bg-primary-600"
    "text-blue-500" = "text-primary-500"
    "text-blue-600" = "text-primary-600"
    "text-blue-700" = "text-primary-700"
    "border-blue-200" = "border-primary-200"
    "border-blue-500" = "border-primary-500"
    "hover:bg-blue-50" = "hover:bg-primary-50"
    "focus:ring-blue-500" = "focus:ring-primary-500"
    "focus:border-blue-500" = "focus:border-primary-500"
    
    # Indigo colors  
    "bg-indigo-50" = "bg-primary-50"
    "bg-indigo-100" = "bg-primary-100"
    "bg-indigo-500" = "bg-primary-500"
    "bg-indigo-600" = "bg-primary-600"
    "text-indigo-500" = "text-primary-500"
    "text-indigo-600" = "text-primary-600"
    "text-indigo-700" = "text-primary-700"
    "border-indigo-200" = "border-primary-200"
    "hover:bg-indigo-50" = "hover:bg-primary-50"
    "hover:text-indigo-600" = "hover:text-primary-600"
    "focus:ring-indigo-500" = "focus:ring-primary-500"
    
    # Violet colors
    "bg-violet-50" = "bg-primary-50"
    "bg-violet-100" = "bg-primary-100"
    "bg-violet-500" = "bg-primary-500"
    "bg-violet-600" = "bg-primary-600"
    "text-violet-600" = "text-primary-600"
    "text-violet-700" = "text-primary-700"
    
    # Purple colors that should be primary
    "bg-purple-50" = "bg-primary-50"
    "bg-purple-100" = "bg-primary-100"
    "bg-purple-500" = "bg-primary-500"
    "bg-purple-600" = "bg-primary-600"
    "text-purple-600" = "text-primary-600"
    "text-purple-700" = "text-primary-700"
    "border-purple-200" = "border-primary-200"
    "hover:bg-purple-50" = "hover:bg-primary-50"
    
    # Focus and ring colors for dropdowns/selects
    "focus:ring-2 focus:ring-primary-500" = "focus:ring-2 focus:ring-primary-500"
    "focus:border-primary-500" = "focus:border-primary-500"
    "ring-blue-500" = "ring-primary-500"
    "ring-indigo-500" = "ring-primary-500"
    "ring-violet-500" = "ring-primary-500"
    "ring-purple-500" = "ring-primary-500"
}

# Get all TypeScript/JavaScript files
$files = @()
foreach ($pattern in $filePatterns) {
    $foundFiles = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue
    $files += $foundFiles
}

$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles files to process..." -ForegroundColor Yellow

foreach ($file in $files) {
    $processedFiles++
    $originalContent = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $originalContent) {
        continue
    }
    
    $modifiedContent = $originalContent
    $fileModified = $false
    
    # Apply color mappings
    foreach ($mapping in $colorMappings.GetEnumerator()) {
        $oldColor = $mapping.Key
        $newColor = $mapping.Value
        
        if ($modifiedContent -match [regex]::Escape($oldColor)) {
            $modifiedContent = $modifiedContent -replace [regex]::Escape($oldColor), $newColor
            $fileModified = $true
        }
    }
    
    # Special handling for select dropdown focus states
    $dropdownFocusPatterns = @{
        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500" = "focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" = "focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        "focus:ring-2 focus:ring-violet-500 focus:border-violet-500" = "focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        "focus:ring-2 focus:ring-purple-500 focus:border-purple-500" = "focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    }
    
    foreach ($pattern in $dropdownFocusPatterns.GetEnumerator()) {
        if ($modifiedContent -match [regex]::Escape($pattern.Key)) {
            $modifiedContent = $modifiedContent -replace [regex]::Escape($pattern.Key), $pattern.Value
            $fileModified = $true
        }
    }
    
    # Write back if modified
    if ($fileModified) {
        try {
            Set-Content -Path $file.FullName -Value $modifiedContent -NoNewline -ErrorAction Stop
            $modifiedFiles++
            Write-Host "  ✓ Updated: $($file.Name)" -ForegroundColor Green
        }
        catch {
            Write-Host "  ✗ Failed to update: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Show progress
    if ($processedFiles % 10 -eq 0) {
        $percentComplete = [math]::Round(($processedFiles / $totalFiles) * 100, 1)
        Write-Host "Progress: $percentComplete% ($processedFiles/$totalFiles files)" -ForegroundColor Cyan
    }
}
}

Write-Host "`nColor update completed!" -ForegroundColor Green
Write-Host "Files processed: $processedFiles" -ForegroundColor White
Write-Host "Files modified: $modifiedFiles" -ForegroundColor Green

if ($modifiedFiles -gt 0) {
    Write-Host "`nAll dropdown focus colors and remaining blue/purple colors have been updated to use the primary orange theme!" -ForegroundColor Yellow
} else {
    Write-Host "`nNo files needed updates - all colors are already using the correct theme!" -ForegroundColor Yellow
}
