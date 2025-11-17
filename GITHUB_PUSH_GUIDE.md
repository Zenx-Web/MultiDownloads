# Pushing to GitHub

## Steps to Push Your Project to GitHub

### 1. Create a New Repository on GitHub

1. Go to [github.com](https://github.com) and log in
2. Click the `+` icon in the top right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `multidownloader` (or any name you prefer)
   - **Description**: "A powerful web app for downloading and converting media from multiple platforms"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **Create repository**

### 2. Add GitHub Remote and Push

Once your repository is created, GitHub will show you commands. Run these in your terminal:

```bash
cd "c:\Users\Maac Panbazar\Desktop\multidowload tool"

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/multidownloader.git

# Verify the remote was added
git remote -v

# Push all commits to GitHub
git branch -M main
git push -u origin main
```

### 3. Alternative: Using SSH (Recommended for frequent pushes)

If you have SSH keys set up with GitHub:

```bash
git remote add origin git@github.com:YOUR_USERNAME/multidownloader.git
git branch -M main
git push -u origin main
```

### 4. Verify Your Upload

After pushing, visit your repository URL:
```
https://github.com/YOUR_USERNAME/multidownloader
```

You should see all your files, commits, and the README.

### 5. Future Updates

After the initial push, you can update GitHub with:

```bash
# Make your changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Important: Update Repository URL in README

After creating your GitHub repository, update the clone URL in `README.md`:

```markdown
git clone https://github.com/YOUR_USERNAME/multidownloader.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Setting Up GitHub Authentication

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name and select scopes: `repo` (full control)
4. Copy the token (you won't see it again!)
5. When pushing, use the token as your password

### Option 2: SSH Keys (More Secure)

1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Start SSH agent:
   ```bash
   # PowerShell
   Start-Service ssh-agent
   ssh-add ~\.ssh\id_ed25519
   ```

3. Copy public key:
   ```bash
   Get-Content ~\.ssh\id_ed25519.pub | clip
   ```

4. Add to GitHub:
   - Go to GitHub Settings → SSH and GPG keys
   - Click **New SSH key**
   - Paste the key and save

5. Use SSH remote URL:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/multidownloader.git
   ```

## Troubleshooting

### Authentication Failed
- Make sure you're using a Personal Access Token, not your password
- GitHub deprecated password authentication in 2021

### Permission Denied (SSH)
- Ensure your SSH key is added to ssh-agent
- Verify the key is added to your GitHub account

### Repository Already Exists
- If you accidentally initialized the GitHub repo with files, you may need to pull first:
  ```bash
  git pull origin main --allow-unrelated-histories
  git push -u origin main
  ```

## Next Steps

After pushing to GitHub:

1. ✅ Add a LICENSE file (if you want open source)
2. ✅ Set up GitHub Actions for CI/CD (optional)
3. ✅ Enable GitHub Pages for documentation (optional)
4. ✅ Add repository topics/tags for discoverability
5. ✅ Create releases for version tracking

Your project is now backed up and shareable on GitHub! 🎉
