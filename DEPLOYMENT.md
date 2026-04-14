# ExamAI Deployment Guide

## Quick Deploy to Vercel (Free)

Your ExamAI app is ready to deploy! Follow these simple steps:

### Step 1: Create a GitHub Account
1. Go to https://github.com/signup
2. Use email: `mb0125319@gmail.com`
3. Create account and verify email

### Step 2: Create a Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste this repository URL: `https://github.com/examai-student/examai`
4. Click "Import"
5. Click "Deploy"

### Step 4: Configure Environment Variables
In Vercel project settings, add these environment variables:
- `DATABASE_URL` - Your database connection string
- `JWT_SECRET` - Generate a random string (e.g., `your-secret-key-123`)
- `VITE_APP_ID` - Manus OAuth App ID
- `OAUTH_SERVER_URL` - Manus OAuth Server URL
- `VITE_OAUTH_PORTAL_URL` - Manus OAuth Portal URL
- `OWNER_OPEN_ID` - Your Manus Open ID
- `OWNER_NAME` - Your name
- `BUILT_IN_FORGE_API_URL` - Manus Forge API URL
- `BUILT_IN_FORGE_API_KEY` - Manus Forge API Key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend Forge API Key
- `VITE_FRONTEND_FORGE_API_URL` - Frontend Forge API URL

### Step 5: Done!
Your site will be live at `examai.vercel.app` 🎉

## Features Included

### Free Tier
- ✅ Upload Notes
- ✅ AI Summaries
- ✅ Basic Quizzes
- ✅ Progress Tracker

### Premium Tier ($7.99/month or $49/year)
- ✅ AI Exam Predictor
- ✅ Smart Quiz Generator
- ✅ Instant Notes-to-Flashcards
- ✅ Weakness Analyzer
- ✅ AI Study Planner

## Support

For issues or questions, check the README.md or FEATURES.md files.
