# PowerShell script to fix dropdown colors
Write-Host "Fixing dropdown and remaining color issues..." -ForegroundColor Green

# Define color mappings
$colorMappings = @{
    "bg-blue-50" = "bg-primary-50"
    "bg-blue-100" = "bg-primary-100" 
    "bg-blue-500" = "bg-primary-500"
    "bg-blue-600" = "bg-primary-600"
    "text-blue-500" = "text-primary-500"
    "text-blue-600" = "text-primary-600"
    "bg-indigo-50" = "bg-primary-50"
    "bg-indigo-100" = "bg-primary-100"
    "bg-indigo-500" = "bg-primary-500"
    "bg-indigo-600" = "bg-primary-600"
    "text-indigo-500" = "text-primary-500"
    "text-indigo-600" = "text-primary-600"
    "hover:bg-indigo-50" = "hover:bg-primary-50"
    "hover:text-indigo-600" = "hover:text-primary-600"
    "bg-violet-50" = "bg-primary-50"
    "bg-violet-100" = "bg-primary-100"
    "bg-violet-500" = "bg-primary-500"
    "bg-violet-600" = "bg-primary-600"
    "text-violet-600" = "text-primary-600"
    "text-violet-700" = "text-primary-700"
    "focus:ring-blue-500" = "focus:ring-primary-500"
    "focus:border-blue-500" = "focus:border-primary-500"
    "focus:ring-indigo-500" = "focus:ring-primary-500"
    "focus:border-indigo-500" = "focus:border-primary-500"
    "focus:ring-violet-500" = "focus:ring-primary-500"
    "focus:border-violet-500" = "focus:border-primary-500"
    "ring-blue-500" = "ring-primary-500"
    "ring-indigo-500" = "ring-primary-500"
    "ring-violet-500" = "ring-primary-500"
}

# Get all component files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" -ErrorAction SilentlyContinue

$modifiedFiles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    
    foreach ($mapping in $colorMappings.GetEnumerator()) {
        $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Color update completed!" -ForegroundColor Green
Write-Host "Files modified: $modifiedFiles" -ForegroundColor Green
