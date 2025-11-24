# 🎨 DOCX Template Formatting Guide

## 📋 Overview

This guide provides **step-by-step instructions** for formatting the DOCX template files so they maintain their visual appeal when filled with resume data. The key principle: **Format the tags themselves, not just the surrounding text**.

---

## 🎯 Core Principle

**When docxtemplater replaces a tag like `{{name}}`, it inherits the formatting applied to that tag.**

This means:
- If `{{name}}` is formatted as 32pt Bold Blue, the actual name will appear as 32pt Bold Blue
- If `{{.}}` in a list is formatted with blue bullets, all list items will have blue bullets
- Formatting applied to tags = Formatting in final document

---

## 🛠️ Required Software

- **Microsoft Word** (recommended) or **Google Docs**
- Access to the `/Templates/` folder in your project

---

## 📁 Template Files

You'll be formatting these three files:
1. **Document 1.docx** - Modern Template
2. **Document 2.docx** - Classic Template  
3. **Document 3.docx** - Executive Template

---

## 🎨 Template 1: MODERN (Document 1.docx)

### Design Philosophy
Clean, minimalist, tech-forward with blue accents

### Color Palette
- **Primary Blue**: RGB(37, 99, 235) or #2563eb
- **Dark Text**: RGB(15, 23, 42) or #0f172a
- **Gray Text**: RGB(100, 116, 139) or #64748b
- **Light Gray**: RGB(226, 232, 240) or #e2e8f0

### Step-by-Step Formatting

#### 1. Name Section
```
{{name}}
```
- **Font**: Calibri or Inter
- **Size**: 32pt
- **Weight**: Bold
- **Color**: Blue (#2563eb)
- **Alignment**: Left
- **Spacing After**: 6pt

#### 2. Contact Information
```
{{email}} | {{phone}} | {{location}}
```
- **Font**: Calibri or Inter
- **Size**: 10pt
- **Weight**: Regular
- **Color**: Gray (#64748b)
- **Alignment**: Left
- **Spacing After**: 20pt
- **Note**: The "|" separators should also be gray

#### 3. Section Headers (e.g., "PROFESSIONAL SUMMARY")
```
PROFESSIONAL SUMMARY
```
- **Font**: Calibri or Inter
- **Size**: 14pt
- **Weight**: Bold
- **Color**: Blue (#2563eb)
- **Case**: UPPERCASE
- **Spacing Before**: 16pt
- **Spacing After**: 8pt
- **Border**: Add a 2pt blue bottom border
- **Alignment**: Left

#### 4. Profile Summary
```
{{profile_summary}}
```
- **Font**: Calibri or Inter
- **Size**: 11pt
- **Weight**: Regular
- **Color**: Dark (#334155)
- **Line Spacing**: 1.15
- **Spacing After**: 12pt
- **Alignment**: Left

#### 5. Work Experience Section
```
WORK EXPERIENCE
{{#work_experience}}
• {{.}}
{{/work_experience}}
```
- **Section Header**: Same as step 3
- **Bullet Points**:
  - **Font**: Calibri or Inter
  - **Size**: 11pt
  - **Weight**: Regular
  - **Color**: Dark (#334155)
  - **Bullet Color**: Blue (#2563eb)
  - **Bullet Style**: Solid circle
  - **Indent**: 0.25"
  - **Spacing After**: 6pt
  - **Line Spacing**: 1.15

#### 6. Education Section
```
EDUCATION
{{#education}}
• {{.}}
{{/education}}
```
- Same formatting as Work Experience

#### 7. Skills Section
```
SKILLS
{{#skills}}
• {{.}}
{{/skills}}
```
- Same formatting as Work Experience

### Complete Modern Template Layout
```
{{name}}
{{email}} | {{phone}} | {{location}}

PROFESSIONAL SUMMARY
{{profile_summary}}

WORK EXPERIENCE
{{#work_experience}}
• {{.}}
{{/work_experience}}

EDUCATION
{{#education}}
• {{.}}
{{/education}}

SKILLS
{{#skills}}
• {{.}}
{{/skills}}

CERTIFICATIONS
{{#certifications}}
• {{.}}
{{/certifications}}
```

### Page Setup
- **Margins**: 0.75" all sides
- **Page Size**: Letter (8.5" x 11")
- **Orientation**: Portrait

---

## 📜 Template 2: CLASSIC (Document 2.docx)

### Design Philosophy
Traditional, professional, timeless with serif fonts

### Color Palette
- **Black**: RGB(0, 0, 0) or #000000
- **Dark Gray**: RGB(51, 51, 51) or #333333
- **Medium Gray**: RGB(102, 102, 102) or #666666

### Step-by-Step Formatting

#### 1. Name Section
```
{{name}}
```
- **Font**: Times New Roman or Georgia
- **Size**: 24pt
- **Weight**: Bold
- **Color**: Black
- **Alignment**: Center
- **Spacing After**: 6pt

#### 2. Contact Information
```
{{email}} | {{phone}} | {{location}}
```
- **Font**: Times New Roman or Georgia
- **Size**: 10pt
- **Weight**: Regular
- **Color**: Black
- **Alignment**: Center
- **Spacing After**: 20pt

#### 3. Section Headers
```
Professional Summary
```
- **Font**: Times New Roman or Georgia
- **Size**: 13pt
- **Weight**: Bold
- **Color**: Black
- **Case**: Title Case
- **Spacing Before**: 14pt
- **Spacing After**: 6pt
- **Border**: Add a 1pt black bottom border (underline)
- **Alignment**: Left

#### 4. Profile Summary
```
{{profile_summary}}
```
- **Font**: Times New Roman or Georgia
- **Size**: 11pt
- **Weight**: Regular
- **Color**: Black
- **Line Spacing**: 1.0
- **Spacing After**: 10pt
- **Alignment**: Justified

#### 5. Work Experience Section
```
Work Experience
{{#work_experience}}
{{.}}

{{/work_experience}}
```
- **Section Header**: Same as step 3
- **Content**:
  - **Font**: Times New Roman or Georgia
  - **Size**: 11pt
  - **Weight**: Regular
  - **Color**: Black
  - **Spacing After**: 8pt (note the blank line in template)
  - **Line Spacing**: 1.0
  - **Alignment**: Left

#### 6. Education Section
```
Education
{{#education}}
{{.}}

{{/education}}
```
- Same formatting as Work Experience

#### 7. Skills Section
```
Skills
{{#skills}}
{{.}}
{{/skills}}
```
- Same formatting as Work Experience but without extra line spacing

### Complete Classic Template Layout
```
{{name}}
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

Certifications
{{#certifications}}
{{.}}
{{/certifications}}
```

### Page Setup
- **Margins**: 1.0" all sides
- **Page Size**: Letter (8.5" x 11")
- **Orientation**: Portrait

---

## 💼 Template 3: EXECUTIVE (Document 3.docx)

### Design Philosophy
Sophisticated, leadership-focused, with subtle shading

### Color Palette
- **Dark Navy**: RGB(15, 23, 42) or #0f172a
- **Medium Dark**: RGB(30, 41, 59) or #1e293b
- **Gray**: RGB(71, 85, 105) or #475569
- **Light Gray Background**: RGB(241, 245, 249) or #f1f5f9

### Step-by-Step Formatting

#### 1. Name Section
```
{{name}}
```
- **Font**: Calibri or Helvetica
- **Size**: 30pt
- **Weight**: Bold
- **Color**: Dark Navy (#0f172a)
- **Case**: ALL CAPS
- **Alignment**: Left
- **Spacing After**: 6pt

#### 2. Contact Information
```
{{email}} | {{phone}} | {{location}}
```
- **Font**: Calibri or Helvetica
- **Size**: 10pt
- **Weight**: Regular
- **Color**: Gray (#475569)
- **Alignment**: Left
- **Spacing After**: 24pt

#### 3. Section Headers
```
EXECUTIVE SUMMARY
```
- **Font**: Calibri or Helvetica
- **Size**: 15pt
- **Weight**: Bold
- **Color**: Medium Dark (#1e293b)
- **Case**: ALL CAPS
- **Spacing Before**: 18pt
- **Spacing After**: 10pt
- **Background**: Light Gray (#f1f5f9) shading
- **Padding**: 4pt top/bottom, 8pt left/right
- **Alignment**: Left

#### 4. Profile Summary
```
{{profile_summary}}
```
- **Font**: Calibri or Helvetica
- **Size**: 11pt
- **Weight**: Regular
- **Color**: Dark (#334155)
- **Line Spacing**: 1.2
- **Spacing After**: 12pt
- **Alignment**: Left

#### 5. Professional Experience Section
```
PROFESSIONAL EXPERIENCE
{{#work_experience}}
{{.}}

{{/work_experience}}
```
- **Section Header**: Same as step 3
- **Content**:
  - **Font**: Calibri or Helvetica
  - **Size**: 11pt
  - **Weight**: Regular
  - **Color**: Dark (#334155)
  - **Spacing After**: 10pt
  - **Line Spacing**: 1.2
  - **Alignment**: Left

#### 6. Education Section
```
EDUCATION & CREDENTIALS
{{#education}}
{{.}}

{{/education}}
```
- Same formatting as Professional Experience

#### 7. Core Competencies Section
```
CORE COMPETENCIES
{{#skills}}
• {{.}}
{{/skills}}
```
- **Section Header**: Same as step 3
- **Bullet Points**:
  - **Font**: Calibri or Helvetica
  - **Size**: 11pt
  - **Weight**: Regular
  - **Color**: Dark (#334155)
  - **Bullet Color**: Dark Gray (#475569)
  - **Bullet Style**: Solid circle
  - **Indent**: 0.25"
  - **Spacing After**: 6pt
  - **Line Spacing**: 1.2

### Complete Executive Template Layout
```
{{name}}
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

CERTIFICATIONS
{{#certifications}}
• {{.}}
{{/certifications}}

KEY ACHIEVEMENTS
{{#achievements}}
• {{.}}
{{/achievements}}
```

### Page Setup
- **Margins**: 0.75" all sides
- **Page Size**: Letter (8.5" x 11")
- **Orientation**: Portrait

---

## 🔧 How to Apply Formatting in Microsoft Word

### Method 1: Direct Formatting
1. Select the tag (e.g., `{{name}}`)
2. Use the Font dialog (Ctrl+D) to set:
   - Font family
   - Size
   - Color
   - Bold/Italic
3. Use Paragraph dialog (Ctrl+M) to set:
   - Alignment
   - Spacing before/after
   - Line spacing
   - Indentation

### Method 2: Using Styles (Recommended)
1. Create custom styles for each element:
   - "Resume Name" style
   - "Resume Contact" style
   - "Resume Section Header" style
   - "Resume Body" style
   - "Resume Bullet" style
2. Apply styles to tags
3. Modify styles as needed

### Adding Borders/Underlines
1. Select the text or tag
2. Go to Format → Borders and Shading
3. Choose border style, color, and width
4. Apply to bottom only for underlines

### Adding Background Shading
1. Select the text or tag
2. Go to Format → Borders and Shading → Shading tab
3. Choose fill color
4. Click OK

### Bullet Formatting
1. Select the `{{.}}` tag
2. Click the Bullets dropdown
3. Choose bullet style
4. Click "Define New Bullet" for custom color
5. Set bullet color and size

---

## ✅ Formatting Checklist

### For Each Template:

- [ ] Name tag formatted with correct font, size, color, weight
- [ ] Contact info tags formatted with correct style
- [ ] All section headers formatted consistently
- [ ] Profile summary tag has correct paragraph formatting
- [ ] Work experience array tags formatted with proper bullets/spacing
- [ ] Education array tags formatted correctly
- [ ] Skills array tags formatted correctly
- [ ] Certifications array tags formatted (if included)
- [ ] Achievements array tags formatted (if included)
- [ ] Page margins set correctly
- [ ] Line spacing set for all sections
- [ ] Colors match the template's color palette
- [ ] Borders/underlines added where specified
- [ ] Background shading added where specified
- [ ] File saved in `/Templates/` folder

---

## 🧪 Testing Your Formatted Templates

### Step 1: Run the Validation Script
```bash
node scripts/validateTemplates.js
```
This will check if all required tags are present.

### Step 2: Test with Sample Data
1. Open the app
2. Create a test resume
3. Select the template you formatted
4. Click "Edit Data" to review parsed data
5. Click "DOCX" to download
6. Open the downloaded file in Word

### Step 3: Verify Formatting
Check that the downloaded resume has:
- ✅ Correct fonts
- ✅ Correct colors
- ✅ Correct sizes
- ✅ Proper spacing
- ✅ Borders/underlines where expected
- ✅ Background shading where expected
- ✅ Professional appearance

### Step 4: Make Adjustments
If formatting isn't perfect:
1. Open the template file again
2. Adjust the formatting on the tags
3. Save the template
4. Test again

---

## 🎯 Pro Tips

### Tip 1: Format the Tag, Not the Space Around It
❌ Wrong: `SKILLS` (formatted) `{{#skills}}` (not formatted)
✅ Right: `SKILLS` (formatted) `{{#skills}}` (also formatted)

### Tip 2: Use Consistent Spacing
- Set spacing in the Paragraph dialog, not by adding extra line breaks
- Use "Spacing Before" and "Spacing After" settings
- This ensures consistent spacing even with varying content

### Tip 3: Test with Long and Short Content
- Test with a long name (e.g., "Christopher Alexander Montgomery III")
- Test with many skills (10+ items)
- Test with minimal experience (1-2 items)
- Ensure formatting works in all cases

### Tip 4: Use Word's Format Painter
1. Format one tag perfectly
2. Select it
3. Click Format Painter (paintbrush icon)
4. Click other similar tags to copy formatting

### Tip 5: Save Frequently
- Save after formatting each section
- Keep a backup copy of templates
- Test after each major change

---

## 🐛 Troubleshooting

### Problem: Formatting Not Appearing in Output
**Solution**: Make sure formatting is applied to the tag itself, not just nearby text.

### Problem: Bullets Not Showing
**Solution**: Ensure `{{.}}` has bullet formatting applied in the template.

### Problem: Colors Look Different
**Solution**: Use RGB values exactly as specified. Word sometimes converts colors.

### Problem: Spacing Is Off
**Solution**: Use Paragraph spacing settings, not manual line breaks.

### Problem: Tags Visible in Output
**Solution**: Check tag spelling and syntax. Run validation script.

---

## 📚 Additional Resources

- **TEMPLATE_TAGS_QUICK_REFERENCE.md** - Quick tag reference
- **DOCX_TEMPLATE_PREPARATION.md** - Original preparation guide
- **scripts/validateTemplates.js** - Template validation tool

---

## 🎉 You're Ready!

Once you've formatted all three templates following this guide:

1. ✅ Templates will look professional
2. ✅ Visual formatting will be preserved
3. ✅ Each template will have its unique style
4. ✅ Generated resumes will match the template design

**Happy formatting! 🎨**
