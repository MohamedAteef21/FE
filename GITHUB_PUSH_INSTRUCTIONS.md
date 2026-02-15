# Instructions for Pushing to GitHub

## Current Issue
The push failed due to authentication. The repository `MohamedAteef21/FE.git` requires proper authentication.

## Solution Options

### Option 1: Use Personal Access Token (Easiest)

1. **Generate a Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "FE Project")
   - Select the `repo` scope
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Push using the token:**
   ```powershell
   cd "D:\mechoo\movies\El Bahwat\FE"
   git push -u origin main
   ```
   - When prompted for username: enter `MohamedAteef21`
   - When prompted for password: **paste your token** (not your GitHub password)

### Option 2: Use SSH Authentication

1. **Generate SSH key (if you don't have one):**
   ```powershell
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   - Press Enter to accept default location
   - Press Enter twice for no passphrase (or set one if preferred)

2. **Copy your public key:**
   ```powershell
   cat ~/.ssh/id_rsa.pub
   ```
   - Copy the entire output

3. **Add SSH key to GitHub:**
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Update remote URL to use SSH:**
   ```powershell
   cd "D:\mechoo\movies\El Bahwat\FE"
   git remote set-url origin git@github.com:MohamedAteef21/FE.git
   git push -u origin main
   ```

### Option 3: Run the PowerShell Script as Administrator

1. **Right-click** `push-to-github.ps1`
2. Select **"Run with PowerShell"** as Administrator
3. Follow the prompts in the script

## Quick Commands

### Check current status:
```powershell
cd "D:\mechoo\movies\El Bahwat\FE"
git status
git remote -v
```

### Add, commit, and push (if you have changes):
```powershell
cd "D:\mechoo\movies\El Bahwat\FE"
git add .
git commit -m "Your commit message"
git push -u origin main
```

### If you need to force push (use with caution):
```powershell
git push -u origin main --force
```

## Troubleshooting

- **403 Forbidden**: Authentication issue - use one of the options above
- **Permission denied**: Make sure you're authenticated with the correct GitHub account
- **Repository not found**: Verify the repository exists and you have access

## Notes

- The repository URL is: `https://github.com/MohamedAteef21/FE.git`
- Current branch: `main`
- The `.gitignore` file is already configured to exclude `node_modules` and other build artifacts

