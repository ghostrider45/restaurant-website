# How to Remove .env File from Git History

Since your `.env` file with sensitive API keys has been committed to the repository, you need to:

1. Rotate your API keys (create new ones and invalidate the old ones)
2. Remove the `.env` file from Git history
3. Ensure `.env` is properly ignored in future commits

## Step 1: Rotate Your API Keys

### Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "restaurant-website-46eaf"
3. Go to Project Settings > General > Your Apps
4. Click on the "⋮" menu for your web app and select "Manage API Key"
5. In the Google Cloud Console, regenerate or create a new API key
6. Update your local `.env` file with the new API key

### Clerk
1. Go to the [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Navigate to API Keys
3. Rotate your publishable key
4. Update your local `.env` file with the new key

## Step 2: Remove .env from Git History

**Warning**: This will rewrite your Git history. If you're working in a shared repository, coordinate with your team.

### Option 1: Using git filter-branch (more complex but thorough)

```bash
# Make sure you have the latest changes
git pull

# Create a backup branch just in case
git checkout -b backup-before-removing-env

# Go back to your main branch
git checkout main

# Remove the file from Git history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

# Force push to overwrite the remote repository
git push origin --force --all
```

### Option 2: Using BFG Repo-Cleaner (easier)

1. Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```bash
# Clone a fresh copy of your repo
git clone --mirror git@github.com:ghostrider45/restaurant-website.git

# Run BFG to remove the .env file
java -jar bfg.jar --delete-files .env restaurant-website.git

# Go into the repo and clean up
cd restaurant-website.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Push the changes
git push
```

## Step 3: Ensure .env is Properly Ignored

1. Make sure `.env` is in your `.gitignore` file
2. Create a `.env.example` file with placeholder values
3. Add instructions in your README about setting up environment variables

## Step 4: Inform Collaborators

If you're working with others, inform them that:
1. The Git history has been rewritten
2. They need to clone the repository again or run:
```bash
git fetch origin
git reset --hard origin/main
```
3. They need to create their own `.env` file based on `.env.example`

## Important Security Note

Even after removing the file from Git history, consider the exposed API keys compromised. Always rotate keys that have been exposed.
