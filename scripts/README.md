# 🛠️ Scripts Directory

## Overview

This directory contains utility scripts for the Resume Blaster application.

---

## 📄 validateTemplates.js

### Purpose
Validates that DOCX template files contain all required tags and are properly formatted for use with docxtemplater.

### Usage

```bash
node scripts/validateTemplates.js
```

### What It Checks

#### Required Single-Value Tags
- `{{name}}` - Full name
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{location}}` - Location
- `{{profile_summary}}` - Professional summary

#### Required Array Tags
- `{{#work_experience}}{{.}}{{/work_experience}}` - Work history
- `{{#education}}{{.}}{{/education}}` - Education
- `{{#skills}}{{.}}{{/skills}}` - Skills

#### Optional Array Tags
- `{{#certifications}}{{.}}{{/certifications}}` - Certifications
- `{{#achievements}}{{.}}{{/achievements}}` - Achievements

### Output

#### Success
```
=== DOCX Template Validator ===

========== Modern Template ==========

Single Tags:
  ✓ {{name}}
  ✓ {{email}}
  ✓ {{phone}}
  ✓ {{location}}
  ✓ {{profile_summary}}

Array Tags:
  ✓ {{#work_experience}}{{.}}{{/work_experience}}
  ✓ {{#education}}{{.}}{{/education}}
  ✓ {{#skills}}{{.}}{{/skills}}

========== Summary ==========
  Modern Template: ✓ VALID
  Classic Template: ✓ VALID
  Executive Template: ✓ VALID

🎉 All valid!
```

#### Failure
```
========== Modern Template ==========

Single Tags:
  ✗ {{name}} - MISSING
  ✓ {{email}}
  ✓ {{phone}}
  ✓ {{location}}
  ✓ {{profile_summary}}

Array Tags:
  ✗ {{#work_experience}}{{.}}{{/work_experience}} - INCOMPLETE
      Missing: {{.}} inside loop
  ✓ {{#education}}{{.}}{{/education}}
  ✓ {{#skills}}{{.}}{{/skills}}

⚠️  Some templates need attention.

Next steps:
  1. Open the template file(s) in Microsoft Word
  2. Add the missing tags as shown in TEMPLATE_FORMATTING_GUIDE.md
  3. Save the file
  4. Run this script again to verify
```

### Exit Codes

- `0` - All templates valid
- `1` - One or more templates have issues

### Dependencies

- `pizzip` - For reading DOCX files
- `fs` - Node.js file system (built-in)
- `path` - Node.js path utilities (built-in)

### How It Works

1. **Reads DOCX files** from `/Templates/` directory
2. **Extracts text content** from document.xml
3. **Parses tags** using regex pattern matching
4. **Validates structure** of single and array tags
5. **Reports results** with clear success/failure indicators

### Template Files Checked

- `Templates/Document 1.docx` - Modern Template
- `Templates/Document 2.docx` - Classic Template
- `Templates/Document 3.docx` - Executive Template

### When to Run

- **After formatting templates** - Verify all tags are present
- **Before deployment** - Ensure templates are production-ready
- **After template updates** - Confirm changes didn't break tags
- **During troubleshooting** - Identify missing or malformed tags

### Troubleshooting

#### Script Won't Run
```bash
# Make sure you're in the project root
cd /path/to/resume-blaster

# Install dependencies if needed
npm install

# Run the script
node scripts/validateTemplates.js
```

#### "File not found" Error
- Verify template files exist in `/Templates/` directory
- Check file names match exactly:
  - `Document 1.docx`
  - `Document 2.docx`
  - `Document 3.docx`

#### "Cannot read property" Error
- Template file may be corrupted
- Try opening and re-saving in Microsoft Word
- Ensure file is a valid DOCX format

### Integration with Workflow

```
1. Format template in Word
   ↓
2. Save template
   ↓
3. Run validation script ← YOU ARE HERE
   ↓
4. Fix any issues
   ↓
5. Re-run validation
   ↓
6. Test with app
```

### Example Workflow

```bash
# 1. Format Document 1.docx in Word
# 2. Save the file
# 3. Validate
node scripts/validateTemplates.js

# If issues found:
# 4. Open template again
# 5. Fix the issues
# 6. Save
# 7. Validate again
node scripts/validateTemplates.js

# When all pass:
# 8. Test in the app
npm run dev
```

---

## 🔮 Future Scripts

Potential future additions to this directory:

- `generateSampleResume.js` - Generate test resume data
- `convertTemplates.js` - Convert between template formats
- `optimizeTemplates.js` - Optimize DOCX file sizes
- `backupTemplates.js` - Backup template files
- `compareTemplates.js` - Compare template versions

---

## 📚 Related Documentation

- **TEMPLATE_FORMATTING_GUIDE.md** - How to format templates
- **VISUAL_TEMPLATE_IMPLEMENTATION_GUIDE.md** - Complete implementation guide
- **QUICK_START_VISUAL_TEMPLATES.md** - Quick start guide
- **TEMPLATE_TAGS_QUICK_REFERENCE.md** - Tag reference

---

## 🤝 Contributing

When adding new scripts:

1. Add clear documentation in this README
2. Include usage examples
3. Add error handling
4. Provide helpful error messages
5. Follow existing code style
6. Test thoroughly

---

## 📝 Notes

- Scripts should be run from the project root directory
- All scripts use Node.js (no additional runtime needed)
- Scripts are designed to be CI/CD friendly
- Exit codes follow Unix conventions (0 = success, non-zero = failure)

---

**For questions or issues, refer to the main documentation files in the project root.**
