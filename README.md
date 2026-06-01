# PDF2Excel AI — High Precision LME & OBL OCR Extraction Engine

A full-stack React + Express utility optimized for ultra-high-precision table parsing, extraction, and generation of multi-sheet Excel workbooks from complex industrial PDFs, LME warrants, and OBL sheets.

---

## 🚀 Ready for Production Deployment

This project has been pre-configured for seamless, instant deployment on both **Vercel** (Serverless) and traditional cloud servers (Docker, Cloud Run, etc.).

### 📂 Configuration Files Included:
- **`vercel.json`**: Pre-configured routing to serve Vite frontend bundle statically on Vercel's global CDN and map fallback `/api/*` endpoints to our serverless Express API function.
- **`api/index.ts`**: The serverless entry-point bridge that imports and binds the Express server inside Vercel's Node environment.
- **`.gitignore`**: Prepared with ideal target exclusions to ensure clean, clutter-free commits.

---

## 💻 Local Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the root root directory (referred from `.env.example`):
```env
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Run Development Server
```bash
npm run dev
```
The app will bind and execute on `http://localhost:3000`.

---

## 🐙 Step 1: Push Project to GitHub

1. **Initialize Git Repository** inside the project folder:
   ```bash
   git init
   ```

2. **Stage and Commit all files**:
   ```bash
   git add .
   git commit -m "feat: initial commit ready for Vercel production hosting"
   ```

3. **Link to your GitHub Remote Repository**:
   - Create a blank repository on your GitHub account.
   - Run the provided connection commands:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## ⚡ Step 2: Deploy to Vercel

### Method A: Deploy via GitHub (Recommended for CI/CD)
1. Go to your **[Vercel Dashboard](https://vercel.com)**.
2. Click **Add New** ➔ **Project**.
3. Import your newly pushed **GitHub repository**.
4. In the configuration window:
   - **Framework Preset**: Vercel automatically detects Vite/React configuration.
   - **Build & Development Settings**: Keep defaults (`npm run build`).
5. Expand the **Environment Variables** panel and add:
   - **`GEMINI_API_KEY`**: Paste your Google AI Gemini API secret key.
6. Click **Deploy**. Vercel will build the frontend, deploy the Serverless endpoints, and give you a global production URL!

### Method B: Deploy via Vercel CLI (Command Line)
1. Install and log in to the Vercel CLI:
   ```bash
   npm install -g vercel
   vercel login
   ```
2. Run the deployment command in the root folder:
   ```bash
   vercel
   ```
3. (Optional) Deploy directly to production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Production Build Verification

To trigger a standard production compilation and verify compilation integrity locally:
```bash
# Build both frontend static assets and node bundles
npm run build

# Start the optimized build
npm run start
```
