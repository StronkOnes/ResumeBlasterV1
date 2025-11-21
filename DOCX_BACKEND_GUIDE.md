# DOCX Processing Backend Implementation Guide

## Overview
This guide provides complete instructions for implementing a backend service to process DOCX templates, fill them with AI-generated content, and convert them to PDF.

---

## Architecture

```
Frontend (React) → Backend API → DOCX Processing → PDF Conversion → Supabase Storage
```

### Flow:
1. User generates resume with AI
2. Frontend sends content + template choice to backend
3. Backend loads DOCX template
4. Backend fills template with structured data
5. Backend converts DOCX to PDF
6. Backend uploads both files to Supabase Storage
7. Backend returns file URLs to frontend
8. Frontend updates database with file paths

---

## Option 1: Node.js Backend (Recommended)

### Dependencies
```bash
npm install express cors
npm install docxtemplater pizzip
npm install docx-pdf
npm install @supabase/supabase-js
npm install multer
```

### Backend Structure
```
backend/
├── server.js
├── services/
│   ├── docxProcessor.js
│   ├── pdfConverter.js
│   └── supabaseStorage.js
├── templates/
│   ├── modern.docx
│   ├── classic.docx
│   └── executive.docx
└── package.json
```

### Implementation

#### 1. server.js
```javascript
const express = require('express');
const cors = require('cors');
const { processResume } = require('./services/docxProcessor');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/process-resume', async (req, res) => {
  try {
    const { content, template, userId, resumeId } = req.body;
    
    // Process DOCX and generate PDF
    const result = await processResume(content, template, userId, resumeId);
    
    res.json({
      success: true,
      docxUrl: result.docxUrl,
      pdfUrl: result.pdfUrl
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

#### 2. services/docxProcessor.js
```javascript
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const { convertToPDF } = require('./pdfConverter');
const { uploadToSupabase } = require('./supabaseStorage');

// Parse AI content into structured data
function parseResumeContent(content) {
  const sections = {};
  let currentSection = 'header';
  let currentContent = [];
  
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('###')) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      // Start new section
      currentSection = line.replace('###', '').trim().toLowerCase().replace(/\s+/g, '_');
      currentContent = [];
    } else if (line.startsWith('#')) {
      sections.name = line.replace('#', '').trim();
    } else if (line.trim()) {
      currentContent.push(line);
    }
  });
  
  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
}

async function processResume(content, template, userId, resumeId) {
  // Load template
  const templatePath = path.join(__dirname, '../templates', `${template}.docx`);
  const templateContent = fs.readFileSync(templatePath, 'binary');
  
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  
  // Parse content into structured data
  const data = parseResumeContent(content);
  
  // Fill template
  doc.render(data);
  
  // Generate DOCX buffer
  const docxBuffer = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });
  
  // Save DOCX temporarily
  const tempDocxPath = path.join(__dirname, '../temp', `${resumeId}.docx`);
  fs.writeFileSync(tempDocxPath, docxBuffer);
  
  // Convert to PDF
  const tempPdfPath = path.join(__dirname, '../temp', `${resumeId}.pdf`);
  await convertToPDF(tempDocxPath, tempPdfPath);
  
  // Upload to Supabase Storage
  const docxUrl = await uploadToSupabase(
    tempDocxPath,
    `${userId}/${resumeId}.docx`,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  
  const pdfUrl = await uploadToSupabase(
    tempPdfPath,
    `${userId}/${resumeId}.pdf`,
    'application/pdf'
  );
  
  // Clean up temp files
  fs.unlinkSync(tempDocxPath);
  fs.unlinkSync(tempPdfPath);
  
  return { docxUrl, pdfUrl };
}

module.exports = { processResume };
```

#### 3. services/pdfConverter.js
```javascript
const docxPdf = require('docx-pdf');
const { promisify } = require('util');

const convertToPDFAsync = promisify(docxPdf);

async function convertToPDF(docxPath, pdfPath) {
  try {
    await convertToPDFAsync(docxPath, pdfPath);
    return pdfPath;
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw new Error('Failed to convert DOCX to PDF');
  }
}

module.exports = { convertToPDF };
```

#### 4. services/supabaseStorage.js
```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for backend
);

async function uploadToSupabase(filePath, storagePath, contentType) {
  const fileBuffer = fs.readFileSync(filePath);
  
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true
    });
  
  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(storagePath);
  
  return publicUrl;
}

module.exports = { uploadToSupabase };
```

---

## Option 2: Python Backend (Alternative)

### Dependencies
```bash
pip install flask flask-cors
pip install python-docx-template
pip install docx2pdf
pip install supabase
```

### Implementation

#### app.py
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.docx_processor import process_resume

app = Flask(__name__)
CORS(app)

@app.route('/api/process-resume', methods=['POST'])
def process_resume_endpoint():
    try:
        data = request.json
        content = data['content']
        template = data['template']
        user_id = data['userId']
        resume_id = data['resumeId']
        
        result = process_resume(content, template, user_id, resume_id)
        
        return jsonify({
            'success': True,
            'docxUrl': result['docx_url'],
            'pdfUrl': result['pdf_url']
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
```

#### services/docx_processor.py
```python
from docxtpl import DocxTemplate
from docx2pdf import convert
import os
from .supabase_storage import upload_to_supabase

def parse_resume_content(content):
    sections = {}
    current_section = 'header'
    current_content = []
    
    lines = content.split('\n')
    
    for line in lines:
        if line.startswith('###'):
            if current_content:
                sections[current_section] = '\n'.join(current_content)
            current_section = line.replace('###', '').strip().lower().replace(' ', '_')
            current_content = []
        elif line.startswith('#'):
            sections['name'] = line.replace('#', '').strip()
        elif line.strip():
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content)
    
    return sections

def process_resume(content, template, user_id, resume_id):
    # Load template
    template_path = f'templates/{template}.docx'
    doc = DocxTemplate(template_path)
    
    # Parse content
    data = parse_resume_content(content)
    
    # Render template
    doc.render(data)
    
    # Save DOCX
    temp_docx = f'temp/{resume_id}.docx'
    doc.save(temp_docx)
    
    # Convert to PDF
    temp_pdf = f'temp/{resume_id}.pdf'
    convert(temp_docx, temp_pdf)
    
    # Upload to Supabase
    docx_url = upload_to_supabase(
        temp_docx,
        f'{user_id}/{resume_id}.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    
    pdf_url = upload_to_supabase(
        temp_pdf,
        f'{user_id}/{resume_id}.pdf',
        'application/pdf'
    )
    
    # Clean up
    os.remove(temp_docx)
    os.remove(temp_pdf)
    
    return {
        'docx_url': docx_url,
        'pdf_url': pdf_url
    }
```

---

## DOCX Template Preparation

### Template Tags
Add these tags to your DOCX templates:

```
{{name}}
{{email}}
{{phone}}
{{location}}
{{profile_summary}}
{{work_experience}}
{{education}}
{{skills}}
{{certifications}}
{{achievements}}
```

### Example Template Structure

**Modern Template (Document 1.docx):**
```
{{name}}
{{email}} | {{phone}} | {{location}}

PROFESSIONAL SUMMARY
{{profile_summary}}

WORK EXPERIENCE
{{work_experience}}

EDUCATION
{{education}}

SKILLS
{{skills}}
```

---

## Frontend Integration

### Update resumeService.ts
```typescript
export const processResumeWithBackend = async (
  resumeId: string,
  content: string,
  template: ResumeTemplate,
  userId: string
): Promise<{ docxUrl: string; pdfUrl: string }> => {
  const response = await fetch('http://localhost:3001/api/process-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      template,
      userId,
      resumeId
    })
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return {
    docxUrl: result.docxUrl,
    pdfUrl: result.pdfUrl
  };
};
```

### Update App.tsx
```typescript
// After saving resume to database
if (savedResume.id) {
  try {
    const { docxUrl, pdfUrl } = await processResumeWithBackend(
      savedResume.id,
      enhancedContent,
      template,
      session.user.id
    );
    
    // Update database with file URLs
    await updateResume(savedResume.id, {
      file_path_docx: docxUrl,
      file_path_pdf: pdfUrl
    });
  } catch (error) {
    console.error('Backend processing error:', error);
  }
}
```

---

## Deployment

### Option 1: Vercel Serverless Functions
```javascript
// api/process-resume.js
module.exports = async (req, res) => {
  // Same logic as server.js
};
```

### Option 2: AWS Lambda
```javascript
exports.handler = async (event) => {
  // Same logic as server.js
};
```

### Option 3: Heroku
```bash
git init
heroku create resume-blaster-backend
git push heroku main
```

---

## Environment Variables

### Backend .env
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
PORT=3001
```

### Frontend .env.local
```env
VITE_BACKEND_URL=http://localhost:3001
# or in production:
VITE_BACKEND_URL=https://your-backend.herokuapp.com
```

---

## Testing

### Test Endpoint
```bash
curl -X POST http://localhost:3001/api/process-resume \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# John Doe\n\n### Work Experience\n- Software Engineer at Tech Co",
    "template": "modern",
    "userId": "test-user-123",
    "resumeId": "test-resume-456"
  }'
```

---

## Current Implementation Status

✅ **Completed:**
- Template-aware PDF generation (client-side)
- Template selection UI
- Template-specific styling
- PDF download with templates

⏳ **Pending (Requires Backend):**
- DOCX template processing
- DOCX to PDF conversion
- File upload to Supabase Storage
- Database update with file paths

---

## Next Steps

1. **Set up backend server** (Node.js or Python)
2. **Prepare DOCX templates** with tags
3. **Test DOCX processing** locally
4. **Deploy backend** to cloud
5. **Integrate frontend** with backend API
6. **Test end-to-end** flow

---

## Support

For questions or issues:
1. Check backend logs
2. Verify template tags match data structure
3. Test DOCX conversion locally
4. Check Supabase Storage permissions
