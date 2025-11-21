# 🚀 Resume Blaster

**AI-Powered Resume Builder with Supabase Integration**

Transform your resume into a professional, ATS-optimized masterpiece using cutting-edge AI technology.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-url.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🤖 AI-Powered Enhancement
- **Gemini 2.5 Flash Integration** - Leverage Google's latest AI model
- **Two Optimization Modes:**
  - 🛡️ **Strict Mode** - Factual improvements only, no hallucinations
  - ⚡ **Power Boost** - AI-enhanced with industry keywords and achievements

### 📝 Resume Management
- **Save & Organize** - All resumes stored securely in Supabase
- **Preview & Download** - View and export as professional PDFs
- **Job Tailoring** - Customize resumes for specific job descriptions
- **History View** - Access all your saved resumes anytime

### 🎨 Modern UI/UX
- **Dark Mode** - Easy on the eyes
- **Responsive Design** - Works on all devices
- **Real-time Preview** - See changes instantly
- **Professional Templates** - Clean, ATS-friendly layouts

### 🔒 Security & Privacy
- **Supabase Authentication** - Secure user accounts
- **Row Level Security** - Your data is private
- **Environment Variables** - API keys safely stored

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19.2** | Frontend framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Supabase** | Database & authentication |
| **Google Gemini AI** | Resume enhancement |
| **jsPDF** | PDF generation |
| **html2canvas** | PDF rendering |
| **Lucide React** | Icons |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/StronkOnes/ResumeBlaster.git
cd ResumeBlaster
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set Up Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create tables and policies

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📚 Documentation

- **[Setup Guide](SUPABASE_SETUP_GUIDE.md)** - Complete Supabase setup
- **[Save Functionality](SAVE_FUNCTIONALITY_README.md)** - How resume saving works
- **[Preview & Download](PREVIEW_DOWNLOAD_GUIDE.md)** - PDF generation details
- **[Troubleshooting](TROUBLESHOOTING_RESUMES.md)** - Common issues & solutions

---

## 🎯 How It Works

### 1. **Create or Upload Resume**
- Enter your resume content manually
- Upload existing resume text
- Add job title and details

### 2. **Choose Optimization Mode**
- **Strict Mode**: Grammar and structure improvements only
- **Power Boost**: AI-enhanced with industry keywords

### 3. **AI Enhancement**
- Gemini AI analyzes your content
- Generates professional, ATS-optimized resume
- Tailors to job description (optional)

### 4. **Preview & Download**
- View formatted resume
- Download as professional PDF
- Save to your history

### 5. **Manage Resumes**
- Access all saved resumes
- Preview, download, or edit anytime
- Organize by job title and date

---

## 📁 Project Structure

```
resume-blaster/
├── components/          # React components
│   ├── Button.tsx
│   ├── Icons.tsx
│   └── Layout.tsx
├── views/              # Page components
│   ├── Home.tsx
│   ├── Editor.tsx
│   ├── Preview.tsx
│   ├── History.tsx
│   ├── Auth.tsx
│   └── Upgrade.tsx
├── services/           # API & database services
│   ├── aiService.ts
│   ├── pdfService.ts
│   ├── resumeService.ts
│   └── supabaseClient.ts
├── public/             # Static assets
│   ├── Favicon.png
│   └── favicon.svg
├── supabase-schema.sql # Database schema
├── types.ts            # TypeScript types
└── App.tsx             # Main app component
```

---

## 🔑 Key Features Explained

### AI Resume Enhancement
The app uses Google's Gemini 2.5 Flash model to:
- Improve grammar and sentence structure
- Add industry-standard keywords
- Quantify achievements
- Optimize for ATS (Applicant Tracking Systems)
- Tailor content to job descriptions

### PDF Generation
- High-quality PDF export using jsPDF
- Preserves formatting and styling
- Multi-page support
- Smart filename generation

### Database Integration
- Supabase PostgreSQL database
- Row Level Security (RLS) for privacy
- Real-time data synchronization
- Automatic timestamps

---

## 🎨 Customization

### Changing AI Model
Edit `services/aiService.ts`:
```typescript
const GEMINI_MODEL = "gemini-2.5-flash"; // Change model here
```

### Modifying Resume Template
Edit `views/Preview.tsx` to customize the resume layout and styling.

### Adding New Features
1. Create new component in `components/` or `views/`
2. Add route in `App.tsx`
3. Update types in `types.ts`

---

## 🐛 Troubleshooting

### Resumes Not Appearing?
1. Check browser console for errors
2. Verify Supabase table exists
3. Run `supabase-schema.sql` if needed
4. See [Troubleshooting Guide](TROUBLESHOOTING_RESUMES.md)

### AI Not Working?
1. Verify `VITE_GEMINI_API_KEY` in `.env.local`
2. Check API key is valid
3. Ensure you're using the correct model name

### PDF Download Issues?
1. Check browser console for errors
2. Ensure popup blocker isn't blocking downloads
3. Try a different browser

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables
Don't forget to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI capabilities
- **Supabase** - For backend infrastructure
- **Tailwind CSS** - For beautiful styling
- **Lucide Icons** - For clean iconography

---

## 📧 Contact

**StronkOnes** - [@StronkOnes](https://github.com/StronkOnes)

Project Link: [https://github.com/StronkOnes/ResumeBlaster](https://github.com/StronkOnes/ResumeBlaster)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ by StronkOnes**
