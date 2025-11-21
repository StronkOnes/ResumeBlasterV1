# Resume Blaster - Setup & Progress Guide

## How to Preview

Since this project is built with standard React/TypeScript and styled with Tailwind CSS via CDN (or configured locally), follow these steps to run it:

### Prerequisites
- Node.js installed.
- A modern web browser.

### Quick Start (Local Development)
1. **Download Code**: Clone the repository or download the files.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   - Create a `.env` file in the root.
   - Add your Gemini API Key: `REACT_APP_API_KEY=your_gemini_api_key` (Note: Implementation currently expects `process.env.API_KEY`, so ensure your build tool injects this).
4. **Run Development Server**:
   ```bash
   npm start
   ```
   or if using Vite:
   ```bash
   npm run dev
   ```

### Preview in Browser
Open `http://localhost:3000` (or the port provided by your bundler) to view the application.

---

## Progress Report

### ✅ Completed Features
1. **Core UI Framework**:
   - Modern, clean, professional interface.
   - Mobile-first responsive layout.
   - Smooth transitions and interactions.
   - **Dark Mode Support** (Toggle added).

2. **Resume Builder Workflows**:
   - **Start from Scratch**: Text editor interface.
   - **Upload Resume**: File input handling (simulated parsing).
   - **Tailor to Job**: Dedicated flow for job description matching.

3. **AI Integration (Google Gemini)**:
   - **Strict Mode (No Hallucinations)**: Optimizes grammar and structure without inventing facts.
   - **Power Boost Mode**: creatively enhances profile based on job title.
   - **Job Tailoring**: Optimizes content against specific job descriptions.

4. **App Views**:
   - **Home**: Dashboard with quick actions.
   - **Editor**: Main workspace with split modes.
   - **Preview**: Markdown rendering of the generated resume.
   - **History**: List of past resumes (simulated persistence).
   - **Upgrade**: Pricing and features page.

### 🚧 In Progress / Remainder
1. **Backend Integration (Supabase)**:
   - [ ] **Authentication**: Sign Up / Login flows.
   - [ ] **Database**: Saving user profiles and resume history.
   - [ ] **Storage**: Storing uploaded and generated resume files.

2. **Payment Processing**:
   - [ ] **Stripe Integration**: Checkout flow for Pro upgrades and One-time boosts.

3. **Document Generation**:
   - [ ] **PDF Export**: Converting the Markdown/HTML output to a downloadable PDF.
   - [ ] **DOCX Export**: Converting to Word format.

4. **File Parsing**:
   - [ ] **Real File Parsing**: implementing `pdf-parse` or similar to extract text from uploaded files before sending to AI.

---

## Supabase Setup Steps (Future)

To complete the backend integration, follow these steps:

1. **Create Project**: Go to Supabase.io and create a new project.
2. **Database Schema**:
   - Create `users` table (id, email, subscription_tier).
   - Create `resumes` table (id, user_id, title, content, mode, created_at).
3. **Auth**: Enable Email/Password login provider.
4. **Env Variables**: Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your project.
5. **Client**: Install `@supabase/supabase-js` and configure the client in `services/supabaseClient.ts`.

## Styling & Theming
The app currently uses Tailwind CSS with a custom palette focusing on `Slate` (Greys/Blues) for a professional look, with `Teal` and `Amber` accents. Dark mode inverses these to `Slate-950/900` backgrounds with light text.
