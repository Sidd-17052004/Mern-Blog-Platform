# Update Axios Imports Script
# Run this in PowerShell from the client directory

$files = @(
    "src/pages/UserProfile.js",
    "src/pages/UserBlogs.js",
    "src/pages/Register.js",
    "src/pages/Login.js",
    "src/pages/EditProfile.js",
    "src/pages/Dashboard.js",
    "src/pages/CreateBlog.js",
    "src/pages/BlogView.js",
    "src/pages/Blogs.js",
    "src/pages/BlogDetails.js",
    "src/pages/AuthPage.js",
    "src/components/Header.js",
    "src/components/BlogCard.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $updated = $content -replace 'import axios from "axios";', 'import axios from "../utils/axios";'
        Set-Content -Path $file -Value $updated
        Write-Host "✅ Updated: $file"
    } else {
        Write-Host "❌ Not found: $file"
    }
}

Write-Host "`n🎉 All files updated successfully!"
