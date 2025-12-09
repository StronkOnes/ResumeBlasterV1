# Mobile App Fix Plan

This document outlines the steps to fix the document upload and AI boosting features in the Resume Blaster mobile app.

## 1. Project Setup

*   **Install Dependencies:** Install `expo-file-system`, `buffer`, and `react-native-dotenv` in the `MobileApp/mobile` directory to handle file operations, data buffering, and environment variables.

## 2. Document Parsing

*   **Remove Placeholder Logic:** In `MobileApp/mobile/src/components/DocumentUpload.tsx`, delete the `simulateBackendDocxExtraction` and `simulateBackendPdfExtraction` functions.
*   **Implement DOCX Parsing (Client-Side):**
    *   Use `expo-document-picker` to allow users to select a `.docx` file.
    *   Use `expo-file-system` to read the selected file's content as a base64 string.
    *   Convert the base64 string to an `ArrayBuffer` using the `buffer` library.
    *   Use the `mammoth` library to extract raw text from the `ArrayBuffer`.
    *   Update the component's state with the extracted text.
*   **Implement PDF Parsing (Backend):**
    *   Create a new Supabase Edge Function named `pdf-parser`.
    *   The function will receive a base64-encoded PDF string from the mobile app.
    *   Inside the function, use a Node.js library like `pdf-parse` to extract text from the PDF buffer.
    *   The function will return the extracted text as a JSON response.
    *   In `MobileApp/mobile/src/components/DocumentUpload.tsx`, update the `parseDocument` function to call this Edge Function when a PDF is selected.

## 3. AI Service Integration

*   **Secure API Key:**
    *   Create a `.env` file in the `MobileApp/mobile` directory to store the `GEMINI_API_KEY`.
    *   Update `babel.config.js` to include the `react-native-dotenv` plugin.
    *   Modify `services/aiService.ts` to import the API key from `@env` instead of `import.meta.env`.
*   **Connect to UI:** Ensure the extracted text from DOCX or PDF is passed to the `generateResumeContent` function in `services/aiService.ts` when the user initiates the "boost" feature.

## 4. Testing

*   **DOCX:** Upload a `.docx` file and verify that its content is extracted and displayed correctly.
*   **PDF:** Upload a `.pdf` file and verify that its content is extracted and displayed correctly.
*   **AI Boost:** After uploading a document, use the AI feature to ensure it successfully modifies the content.
*   **Error Handling:** Test with invalid file types or corrupted files to ensure the app handles errors gracefully.
