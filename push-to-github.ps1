# PowerShell script to push project to GitHub (Run as Administrator)
# Right-click this file and select "Run with PowerShell" as Administrator

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please right-click this file and select 'Run with PowerShell' as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}

# Set the project directory
$projectPath = "D:\mechoo\movies\El Bahwat\FE"
Set-Location $projectPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Push Script (Running as Admin)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Current remote repository:" -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Authentication Options:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Use Personal Access Token (Recommended)"
Write-Host "2. Use SSH key"
Write-Host "3. Configure Git Credential Manager"
Write-Host ""

$choice = Read-Host "Select option (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "To use a Personal Access Token:" -ForegroundColor Yellow
        Write-Host "1. Go to GitHub.com -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)"
        Write-Host "2. Generate a new token with 'repo' permissions"
        Write-Host "3. When prompted for password, paste the token instead"
        Write-Host ""
        Write-Host "Attempting to push..." -ForegroundColor Green
        git push -u origin main
    }
    "2" {
        Write-Host ""
        Write-Host "Setting up SSH authentication..." -ForegroundColor Yellow
        Write-Host "Checking for existing SSH key..." -ForegroundColor Yellow
        
        if (Test-Path "$env:USERPROFILE\.ssh\id_rsa.pub") {
            Write-Host "SSH key found. Public key:" -ForegroundColor Green
            Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
            Write-Host ""
            Write-Host "Add this key to GitHub: Settings -> SSH and GPG keys -> New SSH key"
            Write-Host ""
            Write-Host "Updating remote URL to use SSH..." -ForegroundColor Yellow
            git remote set-url origin git@github.com:MohamedAteef21/FE.git
            Write-Host "Attempting to push..." -ForegroundColor Green
            git push -u origin main
        } else {
            Write-Host "No SSH key found. Generating new SSH key..." -ForegroundColor Yellow
            ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f "$env:USERPROFILE\.ssh\id_rsa" -N '""'
            Write-Host ""
            Write-Host "SSH key generated. Public key:" -ForegroundColor Green
            Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
            Write-Host ""
            Write-Host "Add this key to GitHub: Settings -> SSH and GPG keys -> New SSH key"
            Write-Host "Then run this script again and select option 2"
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Configuring Git Credential Manager..." -ForegroundColor Yellow
        git config --global credential.helper manager-core
        Write-Host "Credential manager configured. Attempting to push..." -ForegroundColor Green
        Write-Host "You will be prompted to authenticate with GitHub." -ForegroundColor Yellow
        git push -u origin main
    }
    default {
        Write-Host "Invalid option. Attempting direct push..." -ForegroundColor Yellow
        git push -u origin main
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Push completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show final status
Write-Host "Final git status:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

