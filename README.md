# InternMatch 🚀

AI-powered internship matcher. Upload your resume and get matched to real tech internships in 30 seconds.

**Powered by Google Gemini 1.5 Flash — completely free.**

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/internmatch.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `internmatch` repository
4. Settings are auto-detected (Create React App) — no changes needed
5. Click **Deploy**

Your app will be live at `https://internmatch.vercel.app` (or similar) in ~2 minutes.

---

## Run locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`

---

## Get a free Gemini API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **"Create API key"**
3. Copy the key — paste it into the app when prompted

No credit card. No billing setup. Free tier is generous enough for personal use.

---

## Tech stack

- **React 18** — UI
- **Google Gemini 1.5 Flash** — AI matching (free tier)
- **Lucide React** — icons
- **Vercel** — hosting (free tier)

No backend. No database. Your resume and API key never leave your browser.

---

## Features

- 🎯 **Match scoring** — honest % fit with explanation
- ✉️ **Cover letter generator** — personalized per role
- 📋 **Resume review** — brutal honest critique + fixes
- 💡 **Interview tips** — role-specific prep advice
- 🔒 **Privacy** — everything runs client-side
