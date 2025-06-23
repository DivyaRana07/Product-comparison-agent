# Quick Setup Guide

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in your project root (same directory as `package.json`):

\`\`\`bash
# Copy the example file
cp .env.example .env
\`\`\`

### 2. Add Your OpenAI API Key

Edit the `.env` file and add your OpenAI API key:

\`\`\`env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
\`\`\`

**Where to get your API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-proj-` or `sk-`)

### 3. Restart the Server

After adding the API key, restart your development server:

\`\`\`bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
\`\`\`

### 4. Verify Setup

The application should now work without the API key error. You can verify by:
1. Opening http://localhost:3000
2. Entering two product names
3. Clicking "Start AI Product Comparison"

## 🔧 Troubleshooting

### "OpenAI API key not configured" Error

**Check these items:**

1. **File Location**: Make sure `.env` is in the project root directory (same level as `package.json`)

2. **File Format**: The `.env` file should look like:
   \`\`\`env
   OPENAI_API_KEY=sk-proj-your-key-here
   \`\`\`

3. **No Spaces**: Make sure there are no spaces around the `=` sign

4. **Restart Required**: Always restart the development server after changing `.env`

5. **Key Format**: OpenAI keys start with `sk-proj-` or `sk-`

### Still Having Issues?

1. **Check Current Directory**:
   \`\`\`bash
   pwd  # Should show your project directory
   ls -la  # Should show .env file
   \`\`\`

2. **Verify File Contents**:
   \`\`\`bash
   cat .env  # Should show your API key
   \`\`\`

3. **Check Server Logs**: Look for detailed error messages in the terminal

## 📁 Project Structure

\`\`\`
product-comparison-agent/
├── .env                 ← Your API key goes here
├── .env.example        ← Template file
├── package.json        ← Project config
├── app/
├── lib/
└── components/
\`\`\`

## ✅ Success Indicators

When everything is working correctly, you should see:
- No API key errors in the console
- Successful product comparisons
- AI-generated analysis in the Results tab
- Detailed logs in the Logs tab

---

**Need help?** Check the main README.md for more detailed information.
