# 🏷️ DOCX Template Tags - Quick Reference

## 📍 Where to Add Tags

Open these files in Microsoft Word or Google Docs:
- `public/Templates/Document 1.docx` (Modern)
- `public/Templates/Document 2.docx` (Classic)
- `public/Templates/Document 3.docx` (Executive)

---

## 🎯 Copy & Paste Template

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
```

---

## 📋 All Available Tags

### Single Value Tags
| Tag | What It Does | Example Output |
|-----|--------------|----------------|
| `{{name}}` | Full name | John Doe |
| `{{email}}` | Email address | john@example.com |
| `{{phone}}` | Phone number | (555) 123-4567 |
| `{{location}}` | Location | New York, NY |
| `{{profile_summary}}` | Professional summary | Experienced software engineer... |

### Array Tags (Lists)
| Tag | What It Does |
|-----|--------------|
| `{{#work_experience}}{{.}}{{/work_experience}}` | Work history items |
| `{{#education}}{{.}}{{/education}}` | Education items |
| `{{#skills}}{{.}}{{/skills}}` | Skills list |
| `{{#certifications}}{{.}}{{/certifications}}` | Certifications |
| `{{#achievements}}{{.}}{{/achievements}}` | Achievements |

---

## ⚠️ Important Rules

### ✅ DO:
- Use exact tag names (case-sensitive)
- Use double curly braces: `{{tag}}`
- Keep tags on their own line
- Use `{{.}}` inside array loops
- Close array tags: `{{#array}}...{{/array}}`

### ❌ DON'T:
- Add spaces: `{{ tag }}` ❌ (should be `{{tag}}` ✅)
- Change tag names: `{{Name}}` ❌ (should be `{{name}}` ✅)
- Forget closing tags: `{{#skills}}` without `{{/skills}}` ❌
- Nest tags incorrectly

---

## 🎨 Example Layouts

### Modern Template (Document 1.docx)
```
{{name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{email}} | {{phone}} | {{location}}

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

### Classic Template (Document 2.docx)
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

### Executive Template (Document 3.docx)
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

---

## 🧪 Test Your Template

After adding tags, test with this sample data:

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
    "BS Computer Science, MIT (2018)"
  ],
  "skills": [
    "JavaScript, React, Node.js",
    "Python, Django, Flask",
    "AWS, Docker, Kubernetes"
  ]
}
```

---

## 🔍 Troubleshooting

### Tags Not Being Replaced?
- ✅ Check spelling (case-sensitive)
- ✅ Remove extra spaces: `{{tag}}` not `{{ tag }}`
- ✅ Verify closing tags for arrays

### List Items Not Showing?
- ✅ Check array syntax: `{{#array}}{{.}}{{/array}}`
- ✅ Ensure `{{.}}` is present
- ✅ Verify closing tag matches opening tag

### Formatting Lost?
- ✅ Apply formatting to the entire tag
- ✅ Use Word's "Format Painter"
- ✅ Save template after formatting

---

## ✅ Quick Checklist

Before using your templates:

- [ ] All tags added to Document 1.docx
- [ ] All tags added to Document 2.docx
- [ ] All tags added to Document 3.docx
- [ ] Tags are spelled correctly (case-sensitive)
- [ ] Array tags have opening and closing tags
- [ ] No extra spaces in tags
- [ ] Formatting applied to tags
- [ ] Templates saved

---

## 🚀 Ready to Use!

Once you've added the tags to all three templates:

1. Save the templates
2. Run `npm run dev`
3. Create a resume
4. Click "DOCX" to download
5. Open the downloaded file to verify tags are filled

**That's it! Your templates are ready! 🎉**
