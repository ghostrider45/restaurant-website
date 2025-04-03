# Environment Variables Setup

## Security Notice

This project uses environment variables to store sensitive information like API keys. To protect these secrets:

1. **NEVER commit your `.env` file to version control**
2. **NEVER share your API keys publicly**
3. **Rotate any exposed API keys immediately**

## Setup Instructions

1. Create a `.env` file in the root directory of the project
2. Copy the contents from `.env.example` to your `.env` file
3. Replace the placeholder values with your actual API keys and configuration

Example:
```
# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8081
```

## What to Do If You've Accidentally Committed API Keys

If you've accidentally committed API keys or other secrets to your repository:

1. **Rotate the keys immediately** - Generate new API keys from the respective service dashboards
2. **Update your local .env file** with the new keys
3. **Add the file to .gitignore** to prevent future commits
4. **Consider using git-filter-repo** to remove sensitive data from your git history (advanced)

## Services That Need API Keys

1. **Clerk** - For authentication
   - Get your API keys from the [Clerk Dashboard](https://dashboard.clerk.dev/)

2. **Firebase** - For database and storage
   - Get your API keys from the [Firebase Console](https://console.firebase.google.com/)
   - Go to Project Settings > General > Your Apps > Web App

Remember: Security is a shared responsibility. Protect your API keys and sensitive information!
