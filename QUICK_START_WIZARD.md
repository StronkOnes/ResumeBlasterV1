# Quick Start Guide - Resume Wizard & Upload Features

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 📦 Installation

### Step 1: Install Dependencies

The implementation added two new dependencies to `package.json`:
- `mammoth` - for DOCX file parsing
- `pdfjs-dist` - for PDF file parsing

Run the following command to install all dependencies:

```bash
npm install
```

Or if you're using yarn:

```bash
yarn install
```

### Step 2: Verify Installation

Check that the new packages are installed:

```bash
npm list mammoth pdfjs-dist
```

You should see:
```
├── mammoth@1.8.0
└── pdfjs-dist@4.0.379
```

---

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## ✅ Testing the New Features

### Test the Wizard

1. Navigate to the application
2. Sign in (or sign up)
3. You'll see the Method Selector
4. Click "Create from Scratch"
5. Complete the 6-step wizard:
   - **Step 1**: Enter your personal information
   - **Step 2**: Write a professional summary
   - **Step 3**: Add at least one work experience
   - **Step 4**: Add at least one education entry
   - **Step 5**: Add some skills
   - **Step 6**: (Optional) Add certifications/achievements
6. Click "Complete & Continue to AI Optimization"
7. Choose a template and optimization mode
8. Click "Enhance & Optimize to 10/10"
9. View your enhanced resume in the Preview

### Test the Document Upload

1. Navigate to the application
2. Sign in (or sign up)
3. You'll see the Method Selector
4. Click "Upload Document"
5. Prepare a test file:
   - **PDF**: Any resume in PDF format
   - **DOCX**: Any resume in Word format
   - **TXT**: Any plain text resume
6. Drag & drop the file or click "Choose File"
7. Wait for text extraction (1-3 seconds)
8. Review the extracted content
9. Edit if needed
10. Click "Continue to AI Optimization"
11. Choose a template and optimization mode
12. Click "Enhance & Optimize to 10/10"
13. View your enhanced resume in the Preview

---

## 🧪 Test Files

### Create Test Files

If you don't have test files, you can create them:

#### Test TXT File
Create a file named `test-resume.txt`:

```
John Doe
john.doe@example.com | (555) 123-4567 | New York, NY

Professional Summary
Experienced software engineer with 5+ years of experience in full-stack development.

Work Experience
Senior Software Engineer - Tech Corp
San Francisco, CA | Jan 2020 - Present
- Led development of microservices architecture
- Managed team of 5 developers
- Improved system performance by 40%

Software Engineer - StartupXYZ
New York, NY | Jun 2018 - Dec 2019
- Developed React-based web applications
- Implemented CI/CD pipelines
- Collaborated with cross-functional teams

Education
Bachelor of Science in Computer Science
University of Technology, Boston, MA
Graduated: May 2018 | GPA: 3.8/4.0

Skills
- JavaScript, TypeScript, React, Node.js
- Python, Django, Flask
- AWS, Docker, Kubernetes
- Git, CI/CD, Agile

Certifications
- AWS Certified Solutions Architect
- Google Cloud Professional Developer
```

#### Test DOCX File
Create a Word document with similar content and save as `test-resume.docx`.

#### Test PDF File
Convert the Word document to PDF and save as `test-resume.pdf`.

---

## 🐛 Troubleshooting

### Issue: Dependencies Not Installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: PDF Upload Not Working

**Possible Causes:**
- PDF is password-protected
- PDF is scanned (image-based, not text)
- PDF is corrupted

**Solution:**
- Try a different PDF file
- Ensure the PDF contains selectable text
- Check browser console for errors

### Issue: DOCX Upload Not Working

**Possible Causes:**
- DOCX file is corrupted
- DOCX file is too large (>10MB)
- DOCX file has complex formatting

**Solution:**
- Try a simpler DOCX file
- Check file size
- Check browser console for errors

### Issue: Wizard Not Proceeding to Next Step

**Possible Causes:**
- Required fields not filled
- Validation failing

**Solution:**
- Ensure all required fields (marked with *) are filled
- Check for error messages
- Try refreshing the page

### Issue: "Module not found" Errors

**Solution:**
```bash
# Ensure all dependencies are installed
npm install

# If using TypeScript, ensure types are installed
npm install --save-dev @types/node
```

---

## 🔍 Debugging

### Enable Verbose Logging

Open browser console (F12) to see detailed logs:
- Document parsing progress
- Validation errors
- API calls
- State changes

### Check Network Tab

Monitor network requests:
- AI service calls
- Template downloads
- Authentication requests

### React DevTools

Install React DevTools browser extension to:
- Inspect component state
- Track prop changes
- Monitor re-renders

---

## 📊 Performance Tips

### For Large Documents

If uploading large documents (>5MB):
- Expect longer processing times (3-5 seconds)
- Consider splitting into smaller sections
- Use TXT format for faster processing

### For Slow Connections

If on a slow internet connection:
- PDF.js worker loads from CDN (may take time)
- Consider bundling the worker locally
- Use TXT format instead of PDF/DOCX

---

## 🔐 Security Notes

### Client-Side Processing

All document parsing happens in the browser:
- ✅ Documents never uploaded to servers
- ✅ Only extracted text sent to AI service
- ✅ Privacy-focused design

### File Validation

Files are validated before processing:
- ✅ File type checking
- ✅ File size limits (10MB)
- ✅ Error handling for malicious files

---

## 📱 Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Not Supported

- ❌ Internet Explorer
- ❌ Opera Mini
- ❌ Older mobile browsers

---

## 🎯 Next Steps

After testing the new features:

1. **Explore Templates**: Try all three templates (Modern, Classic, Executive)
2. **Test Both Modes**: Compare Strict Mode vs Power Boost
3. **Save Resumes**: Test the History feature
4. **Edit Resumes**: Try editing saved resumes
5. **Download**: Test PDF and DOCX downloads

---

## 📞 Need Help?

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review browser console for errors
3. Check the IMPLEMENTATION_SUMMARY_WIZARD.md for technical details
4. Review the WIZARD_UPLOAD_FEATURE.md for feature documentation

---

## ✨ Enjoy!

You're all set! The Resume Blaster application now has powerful wizard and upload features to help users create amazing resumes. Happy building! 🚀
