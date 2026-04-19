# Clear oversized Firestore fields using Firebase REST API
# This script removes the large base64 image fields that are causing the document to exceed size limits

$projectId = "mallavaramsvbs"
$docPath = "config/siteContent"

# Get the current document to preserve other data
Write-Host "Fetching current document from Firestore..."

$getUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$docPath"

try {
    $response = Invoke-RestMethod -Uri $getUrl -Method Get -ErrorAction Stop
    Write-Host "✓ Document fetched successfully"
    
    # Remove the large image fields
    $fieldsToRemove = @("aboutImages", "activitiesPhotos", "annadanamPhotos", "templeHistoryImages")
    
    foreach ($field in $fieldsToRemove) {
        if ($response.fields.PSObject.Properties.Name -contains $field) {
            $response.fields.PSObject.Properties.Remove($field)
            Write-Host "  - Removed field: $field"
        }
    }
    
    # Update the document with remaining fields
    Write-Host "Updating document in Firestore..."
    
    $updateUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$docPath"
    
    $body = @{
        fields = $response.fields
    } | ConvertTo-Json -Depth 10
    
    $updateResponse = Invoke-RestMethod -Uri $updateUrl -Method Patch -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✓ Successfully cleared oversized image fields!"
    Write-Host ""
    Write-Host "You can now:"
    Write-Host "1. Go to Configure section"
    Write-Host "2. Upload new images for Activities and Annadanam photos"
    Write-Host "3. Click Save buttons to persist to Firestore"
    
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Alternative: Go to Firebase Console manually:"
    Write-Host "1. Open https://console.firebase.google.com"
    Write-Host "2. Select 'mallavaramsvbs' project"
    Write-Host "3. Go to Firestore Database"
    Write-Host "4. Find config/siteContent document"
    Write-Host "5. Delete these fields:"
    Write-Host "   - aboutImages"
    Write-Host "   - activitiesPhotos"
    Write-Host "   - annadanamPhotos"
    Write-Host "   - templeHistoryImages"
}
