# Resume Creation Wizard & Document Upload Feature

## Overview

This update introduces a comprehensive resume creation experience with two distinct methods:

1. **Create from Scratch (Wizard)** - A step-by-step guided wizard for building resumes from the ground up
2. **Upload Document** - Support for uploading existing resumes in PDF, DOCX, or TXT format

## Features Implemented

### 1. Method Selector
- **Location**: `components/MethodSelector.tsx`
- **Purpose**: Allows users to choose between wizard-based creation or document upload
- **Design**: Two large, interactive cards with clear descriptions and visual indicators

### 2. Resume Wizard
- **Location**: `components/ResumeWizard.tsx`
- **Steps**:
  1. **Personal Information** - Name, email, phone, location, LinkedIn, website
  2. **Professional Summary** - Career objective and summary
  3. **Work Experience** - Add multiple work experiences with details
  4. **Education** - Add educational background
  5. **Skills** - Add technical and soft skills
  6. **Additional** - Certifications and achievements (optional)

- **Features**:
  - Progress bar showing current step
  - Validation at each step
  - Add/remove multiple entries for work experience and education
  - Dynamic skill/certification/achievement management
  - Converts all data to markdown format for AI processing

### 3. Document Upload
- **Location**: `components/DocumentUpload.tsx`
- **Supported Formats**: PDF, DOCX, TXT, MD
- **Features**:
  - Drag & drop interface
  - File validation (type and size)
  - Real-time text extraction
  - Editable preview of extracted content
  - Privacy-focused (local processing)

### 4. Document Parser Service
- **Location**: `services/documentParser.ts`
- **Capabilities**:
  - PDF parsing using `pdfjs-dist`
  - DOCX parsing using `mammoth`
  - TXT/MD file reading
  - File validation
  - Error handling with user-friendly messages

### 5. Updated Editor Flow
- **Location**: `views/Editor.tsx`
- **New Flow**:
  1. Method Selection
  2. Content Input (Wizard or Upload)
  3. AI Optimization Options
  4. Template Selection
  5. Mode Selection (Strict/Power Boost)
  6. Generate Enhanced Resume

## Dependencies Added

```json
{
  "mammoth": "^1.8.0",
  "pdfjs-dist": "^4.0.379"
}
```

## User Experience Improvements

### Before
- Users had to manually paste or type resume content into a text area
- No guidance on what information to include
- No support for uploading existing documents

### After
- **Guided Experience**: Step-by-step wizard with clear instructions
- **Flexible Input**: Choose between creating from scratch or uploading
- **Document Support**: Upload PDF, DOCX, or TXT files
- **Better Validation**: Each step validates required information
- **Visual Progress**: Clear progress indicators throughout the process
- **Editable Content**: Review and edit extracted content before AI processing

## Technical Implementation

### State Management
The Editor component now manages three distinct states:
1. `selectedMethod`: null | 'wizard' | 'upload'
2. `showOptimization`: boolean (controls when to show AI options)
3. `content`: string (the final resume content)

### Data Flow
```
Method Selector
    ↓
Wizard OR Upload
    ↓
Content Ready
    ↓
Optimization Options
    ↓
AI Generation
    ↓
Preview
```

### Component Architecture
```
Editor (Container)
├── MethodSelector
├── ResumeWizard
│   ├── PersonalInfoStep
│   ├── SummaryStep
│   ├── WorkExperienceStep
│   ├── EducationStep
│   ├── SkillsStep
│   └── AdditionalStep
├── DocumentUpload
└── Optimization UI
```

## File Structure

```
components/
├── MethodSelector.tsx       (NEW)
├── ResumeWizard.tsx         (NEW)
├── DocumentUpload.tsx       (NEW)
└── ...

services/
├── documentParser.ts        (NEW)
└── ...

views/
├── Editor.tsx              (UPDATED)
└── ...
```

## Usage Instructions

### For Users Creating from Scratch:
1. Click "Create from Scratch" on the method selector
2. Follow the 6-step wizard:
   - Enter personal information
   - Write professional summary
   - Add work experiences
   - Add education
   - Add skills
   - Add certifications/achievements (optional)
3. Review and complete
4. Choose optimization mode and template
5. Generate AI-enhanced resume

### For Users Uploading Documents:
1. Click "Upload Document" on the method selector
2. Drag & drop or browse for file (PDF, DOCX, TXT)
3. Wait for text extraction
4. Review and edit extracted content
5. Continue to optimization
6. Choose optimization mode and template
7. Generate AI-enhanced resume

## Error Handling

- **File Validation**: Checks file type and size before processing
- **Parsing Errors**: User-friendly error messages for corrupted files
- **Empty Content**: Prevents proceeding with empty content
- **Network Errors**: Graceful handling of AI service failures

## Accessibility

- Keyboard navigation support
- Clear focus indicators
- Semantic HTML structure
- ARIA labels where appropriate
- High contrast mode support (dark theme)

## Future Enhancements

Potential improvements for future iterations:
- Auto-save draft functionality
- Import from LinkedIn
- Resume templates preview before selection
- Multi-language support
- Resume scoring before AI optimization
- Export to multiple formats simultaneously

## Testing Recommendations

1. **Wizard Flow**:
   - Test all 6 steps with valid data
   - Test validation at each step
   - Test add/remove functionality for dynamic lists
   - Test back navigation

2. **Document Upload**:
   - Test with various PDF files
   - Test with various DOCX files
   - Test with TXT files
   - Test file size limits
   - Test invalid file types
   - Test corrupted files

3. **Integration**:
   - Test complete flow from method selection to AI generation
   - Test switching between methods
   - Test back navigation at each stage
   - Test with both optimization modes
   - Test with all templates

## Notes for Developers

- The wizard converts all data to markdown format for consistency with the AI service
- Document parsing happens client-side for privacy
- PDF.js worker is loaded from CDN (can be bundled if needed)
- All components follow the existing design system
- Dark mode is fully supported throughout

## Installation

After pulling these changes, run:

```bash
npm install
```

This will install the new dependencies (`mammoth` and `pdfjs-dist`).

## Backward Compatibility

The changes are fully backward compatible. The existing flow still works, but users now have additional options for creating their resumes.
