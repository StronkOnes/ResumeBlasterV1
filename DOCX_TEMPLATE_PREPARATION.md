# DOCX Template Preparation Guide

## 🎯 Overview

This guide explains how to prepare your DOCX templates so they can be automatically filled with AI-generated resume content.

---

## 📋 Template Tags

Your DOCX templates need to include special tags that will be replaced with actual resume data. Tags use the format: `{{tag_name}}`

### Basic Information Tags

```
{{name}}              - Full name
{{email}}             - Email address
{{phone}}             - Phone number
{{location}}          - City, State or location
{{profile_summary}}   - Professional summary/objective
```

### Section Tags (Arrays)

These tags will be replaced with lists of items:

```
{{#work_experience}}
{{.}}
{{/work_experience}}

{{#education}}
{{.}}
{{/education}}

{{#skills}}
{{.}}
{{/skills}}

{{#certifications}}
{{.}}
{{/certifications}}

{{#achievements}}
{{.}}
{{/achievements}}
```

---

## 🎨 How to Prepare Templates

### Step 1: Open Your DOCX Template

Open `Document 1.docx`, `Document 2.docx`, or `Document 3.docx` in Microsoft Word or Google Docs.

### Step 2: Add Tags to Your Template

#### Example Modern Template (Document 1.docx):

```
{{name}}
{{email}} | {{phone}} | {{location}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
{{profile_summary}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORK EXPERIENCE
{{#work_experience}}
• {{.}}
{{/work_experience}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION
{{#education}}
• {{.}}
{{/education}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILLS
{{#skills}}
• {{.}}
{{/skills}}
```

#### Example Classic Template (Document 2.docx):

```
{{name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Information
{{email}} | {{phone}} | {{location}}

Professional Summary
{{profile_summary}}

Work Experience
{{#work_experience}}
{{.}}

{{/work_experience}}

Education
{{#education}}
{{.}}

{{/education}}

Skills
{{#skills}}
{{.}}
{{/skills}}
```

#### Example Executive Template (Document 3.docx):

```
{{name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{email}} | {{phone}} | {{location}}

EXECUTIVE SUMMARY
{{profile_summary}}

PROFESSIONAL EXPERIENCE
{{#work_experience}}
{{.}}

{{/work_experience}}

EDUCATION & CREDENTIALS
{{#education}}
{{.}}

{{/education}}

CORE COMPETENCIES
{{#skills}}
• {{.}}
{{/skills}}

{{#certifications}}
• {{.}}
{{/certifications}}
```

### Step 3: Format Your Template

Apply your desired formatting:

**Modern Template:**
- Font: Calibri or Arial
- Name: 24pt, Bold, Blue (#2563eb)
- Section Headers: 14pt, Bold, Blue, Uppercase
- Body: 11pt, Regular
- Use blue accent lines

**Classic Template:**
- Font: Times New Roman or Georgia
- Name: 22pt, Bold, Centered
- Section Headers: 14pt, Bold, Underlined
- Body: 11pt, Regular
- Use traditional formatting

**Executive Template:**
- Font: Calibri or Helvetica
- Name: 26pt, Bold, ALL CAPS
- Section Headers: 15pt, Bold, ALL CAPS
- Body: 11pt, Regular
- Use subtle gray shading for sections

### Step 4: Save Your Template

1. Save the file in the `/Templates/` folder
2. Keep the filename as is:
   - `Document 1.docx` for Modern
   - `Document 2.docx` for Classic
   - `Document 3.docx` for Executive

---

## 🔧 Testing Your Template

### Test Data Example

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "location": "New York, NY",
  "profile_summary": "Experienced software engineer with 5+ years...",
  "work_experience": [
    "Senior Software Engineer at Tech Corp (2020-Present)",
    "Software Engineer at StartUp Inc (2018-2020)"
  ],
  "education": [
    "BS Computer Science, MIT (2018)",
    "High School Diploma, NYC High (2014)"
  ],
  "skills": [
    "JavaScript, React, Node.js",
    "Python, Django, Flask",
    "AWS, Docker, Kubernetes"
  ]
}
```

---

## 📝 Tag Reference

### Single Value Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `{{name}}` | Full name | John Doe |
| `{{email}}` | Email address | john@example.com |
| `{{phone}}` | Phone number | (555) 123-4567 |
| `{{location}}` | Location | New York, NY |
| `{{profile_summary}}` | Professional summary | Experienced engineer... |

### Array Tags (Lists)

| Tag | Description |
|-----|-------------|
| `{{#work_experience}}{{.}}{{/work_experience}}` | Work history items |
| `{{#education}}{{.}}{{/education}}` | Education items |
| `{{#skills}}{{.}}{{/skills}}` | Skills list |
| `{{#certifications}}{{.}}{{/certifications}}` | Certifications |
| `{{#achievements}}{{.}}{{/achievements}}` | Achievements |

### Array Tag Syntax

```
{{#array_name}}
• {{.}}
{{/array_name}}
```

- `{{#array_name}}` - Start of loop
- `{{.}}` - Current item
- `{{/array_name}}` - End of loop

---

## 🎨 Styling Tips

### Modern Template
- Use sans-serif fonts (Calibri, Arial)
- Blue accent color (#2563eb)
- Clean lines and spacing
- Bullet points for lists
- Minimal decoration

### Classic Template
- Use serif fonts (Times New Roman, Georgia)
- Black and gray colors
- Traditional underlines
- Formal spacing
- Conservative design

### Executive Template
- Use professional fonts (Calibri, Helvetica)
- Dark colors (#0f172a)
- ALL CAPS for headers
- Subtle shading
- Sophisticated layout

---

## ⚠️ Important Notes

### Do's ✅
- Use exact tag names as specified
- Keep tags on their own line for better formatting
- Test with sample data before deploying
- Maintain consistent spacing
- Use proper formatting (bold, colors, etc.)

### Don'ts ❌
- Don't modify tag names (case-sensitive)
- Don't nest tags incorrectly
- Don't use special characters in tags
- Don't forget closing tags for arrays
- Don't remove the `{{.}}` in array loops

---

## 🔍 Troubleshooting

### Tags Not Being Replaced

**Problem:** Tags appear as-is in the output
**Solution:** 
- Check tag spelling (case-sensitive)
- Ensure tags are properly formatted: `{{tag_name}}`
- Verify no extra spaces: `{{ tag }}` is wrong

### Array Items Not Showing

**Problem:** List items don't appear
**Solution:**
- Check array syntax: `{{#array}}{{.}}{{/array}}`
- Ensure closing tag matches opening tag
- Verify data contains array items

### Formatting Lost

**Problem:** Template formatting disappears
**Solution:**
- Apply formatting to the entire tag, not just text
- Use Word's "Format Painter" to copy formatting
- Save template after formatting changes

---

## 📦 Installation Steps

### 1. Install Dependencies

Run this command in your project:
```bash
npm install docx file-saver pizzip docxtemplater
```

### 2. Prepare Templates

1. Open each DOCX file in `/Templates/`
2. Add tags as shown above
3. Apply formatting
4. Save files

### 3. Test the System

1. Create a resume in the app
2. Select a template
3. Click "Edit Data" to review parsed data
4. Click "DOCX" to download
5. Open the downloaded file to verify

---

## 🚀 Usage in the App

### For Users

1. **Create Resume:**
   - Enter your content
   - Select a template
   - Generate with AI

2. **Review Data:**
   - Click "Edit Data" in Preview
   - Review parsed information
   - Make any corrections
   - Click "Apply Changes"

3. **Download DOCX:**
   - Click "DOCX" button
   - File downloads automatically
   - Open in Word/Google Docs
   - Make final edits if needed

### For Developers

The system automatically:
1. Parses AI-generated markdown content
2. Extracts structured data (name, email, etc.)
3. Loads the selected DOCX template
4. Fills template with data
5. Generates downloadable DOCX file

---

## 📊 Data Extraction Logic

### How Content is Parsed

```typescript
// Headers starting with # become the name
# John Doe  →  name: "John Doe"

// Email patterns are detected
john@example.com  →  email: "john@example.com"

// Phone patterns are detected
(555) 123-4567  →  phone: "(555) 123-4567"

// Section headers (###) define sections
### Work Experience  →  work_experience: [...]

// Bullet points become array items
- Item 1  →  ["Item 1", "Item 2", ...]
- Item 2
```

---

## 🎯 Best Practices

### Template Design
1. Keep it simple and clean
2. Use consistent spacing
3. Test with various content lengths
4. Ensure readability
5. Follow ATS-friendly guidelines

### Tag Placement
1. Place tags where data should appear
2. Use proper formatting around tags
3. Test with empty data (tags should disappear)
4. Ensure proper line breaks
5. Maintain document structure

### Testing
1. Test with minimal data
2. Test with maximum data
3. Test with missing fields
4. Test with special characters
5. Test on different devices

---

## 📚 Examples

### Minimal Template

```
{{name}}
{{email}} | {{phone}}

{{profile_summary}}

Experience:
{{#work_experience}}
• {{.}}
{{/work_experience}}

Skills:
{{#skills}}
• {{.}}
{{/skills}}
```

### Full Template

```
{{name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{email}} | {{phone}} | {{location}}

PROFESSIONAL SUMMARY
{{profile_summary}}

WORK EXPERIENCE
{{#work_experience}}
{{.}}

{{/work_experience}}

EDUCATION
{{#education}}
{{.}}

{{/education}}

TECHNICAL SKILLS
{{#skills}}
• {{.}}
{{/skills}}

CERTIFICATIONS
{{#certifications}}
• {{.}}
{{/certifications}}

ACHIEVEMENTS
{{#achievements}}
• {{.}}
{{/achievements}}
```

---

## ✅ Checklist

Before deploying your templates:

- [ ] All tags are properly formatted
- [ ] Array tags have opening and closing tags
- [ ] Formatting is applied correctly
- [ ] Template is saved in `/Templates/` folder
- [ ] Tested with sample data
- [ ] No spelling errors in tags
- [ ] Proper spacing and line breaks
- [ ] ATS-friendly design
- [ ] Professional appearance
- [ ] Works on different devices

---

## 🆘 Support

If you encounter issues:

1. Check tag spelling (case-sensitive)
2. Verify template file location
3. Test with simple data first
4. Check browser console for errors
5. Review this guide for proper syntax

---

**Your templates are now ready to automatically fill with AI-generated resume content!** 🎉
