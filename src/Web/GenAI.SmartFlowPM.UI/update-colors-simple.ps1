# PowerShell script to update color scheme throughout the UI project
Write-Host "Updating color scheme across all components..." -ForegroundColor Cyan

$projectPath = "."

# Simple find and replace operations
$replacements = @{
    "bg-blue-50" = "bg-primary-50"
    "bg-blue-100" = "bg-primary-100"
    "bg-blue-600" = "bg-primary-500"
    "bg-blue-700" = "bg-primary-600"
    "text-blue-600" = "text-primary-600"
    "text-blue-700" = "text-primary-700"
    "text-blue-800" = "text-primary-800"
    "text-blue-900" = "text-secondary-500"
    "border-blue-200" = "border-primary-200"
    "ring-blue-500" = "ring-primary-500"
    "focus:ring-blue-500" = "focus:ring-primary-500"
    "focus:border-blue-500" = "focus:border-primary-500"
    "bg-purple-600" = "bg-accent"
    "bg-purple-700" = "bg-accent-foreground"
    "text-purple-600" = "text-accent"
    "bg-purple-100" = "bg-orange-100"
    "ring-purple-500" = "ring-accent"
    "focus:ring-purple-500" = "focus:ring-accent"
}

$files = Get-ChildItem -Path $projectPath -Recurse -Include "*.tsx", "*.ts" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.next*"
}

$updateCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content.Contains($old)) {
            $content = $content.Replace($old, $new)
            Write-Host "Updated $($file.Name): $old -> $new" -ForegroundColor Green
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updateCount++
    }
}

Write-Host "Color update complete! Updated $updateCount files." -ForegroundColor Green
