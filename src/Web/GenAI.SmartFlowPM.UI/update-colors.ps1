# PowerShell script to update color scheme throughout the UI project
# This script updates hardcoded blue, purple, and sky colors to the new orange-based scheme

Write-Host "🎨 Updating color scheme across all components..." -ForegroundColor Cyan

$projectPath = "."
$extensions = @("*.tsx", "*.ts", "*.jsx", "*.js")

# Color mappings for systematic replacement
$colorMappings = @{
    # Blue to Primary Orange mappings
    "bg-blue-50" = "bg-primary-50"
    "bg-blue-100" = "bg-primary-100"
    "bg-blue-600" = "bg-primary-500"
    "bg-blue-700" = "bg-primary-600"
    "text-blue-600" = "text-primary-600"
    "text-blue-700" = "text-primary-700"
    "text-blue-800" = "text-primary-800"
    "text-blue-900" = "text-secondary-500"
    "border-blue-200" = "border-primary-200"
    "border-blue-300" = "border-primary-300"
    "ring-blue-500" = "ring-primary-500"
    "focus:ring-blue-500" = "focus:ring-primary-500"
    "focus:border-blue-500" = "focus:border-primary-500"
    
    # Purple to Accent mappings
    "bg-purple-50" = "bg-orange-50"
    "bg-purple-100" = "bg-orange-100"
    "bg-purple-600" = "bg-accent"
    "bg-purple-700" = "bg-accent-foreground"
    "text-purple-600" = "text-accent"
    "text-purple-700" = "text-accent-foreground"
    "border-purple-200" = "border-orange-200"
    "ring-purple-500" = "ring-accent"
    "focus:ring-purple-500" = "focus:ring-accent"
    
    # Sky to Primary mappings
    "bg-sky-50" = "bg-primary-50"
    "bg-sky-100" = "bg-primary-100"
    "bg-sky-600" = "bg-primary-500"
    "text-sky-600" = "text-primary-600"
    "border-sky-200" = "border-primary-200"
}

$fileCount = 0
$updateCount = 0

# Function to update files
function Update-FileColors {
    param($filePath)
    
    $content = Get-Content -Path $filePath -Raw
    $originalContent = $content
    
    foreach ($oldColor in $colorMappings.Keys) {
        $newColor = $colorMappings[$oldColor]
        if ($content.Contains($oldColor)) {
            $content = $content -replace [regex]::Escape($oldColor), $newColor
            Write-Host "  ✓ $($filePath): $oldColor → $newColor" -ForegroundColor Green
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -NoNewline
        return $true
    }
    return $false
}

# Process all TypeScript/JavaScript files
foreach ($extension in $extensions) {
    $files = Get-ChildItem -Path $projectPath -Recurse -Include $extension | 
             Where-Object { 
                 $_.FullName -notlike "*node_modules*" -and 
                 $_.FullName -notlike "*.next*" -and
                 $_.FullName -notlike "*dist*" 
             }
    
    foreach ($file in $files) {
        $fileCount++
        $wasUpdated = Update-FileColors -filePath $file.FullName
        if ($wasUpdated) {
            $updateCount++
        }
    }
}

Write-Host ""
Write-Host "🎉 Color update complete!" -ForegroundColor Green
Write-Host "📊 Files processed: $fileCount" -ForegroundColor Yellow
Write-Host "📝 Files updated: $updateCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Your app now uses the new color scheme:" -ForegroundColor Cyan
Write-Host "   • Primary: #FF851B (Light Orange)" -ForegroundColor Yellow
Write-Host "   • Accent: #E76E04 (Dark Orange)" -ForegroundColor Yellow  
Write-Host "   • Background: #FFFFFF (White)" -ForegroundColor White
Write-Host "   • Text: #001F3F (Black Type)" -ForegroundColor Black
Write-Host "   • Font: Ubuntu Regular" -ForegroundColor Gray
