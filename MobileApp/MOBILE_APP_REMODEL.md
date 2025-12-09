# Mobile App Remodel Plan

This document outlines the plan to remodel the mobile app to match the web app's design, features, and functionality.

## 1. Analysis

### Web App Analysis

- **Framework:** React with Vite.
- **UI:** Custom UI with a state-machine-like navigation. Components are in `components/`. Dark mode is supported.
- **Authentication:** Supabase for user and admin authentication.
- **Features:**
  - Resume creation wizard.
  - Document upload (PDF, DOCX).
  - AI-powered resume generation with "Strict" and "Power Boost" modes.
  - Resume tailoring based on a job description.
  - Template selection.
  - Resume preview.
  - Resume history.
  - PDF/DOCX download.
  - Admin dashboard for metrics.
- **AI Service:** Uses `@google/genai` directly on the client-side.

### Mobile App Analysis

- **Framework:** React Native with Expo.
- **UI:** Uses React Navigation. The UI is inconsistent and does not match the web app.
- **Authentication:** Supabase is set up, but the flow is not complete.
- **Features (Current State):**
  - Basic navigation between screens.
  - A non-functional resume generation form that makes a network request to a hardcoded local IP.
  - A document upload component that is not fully integrated and has placeholder parsing logic.
  - Missing features: wizard, template selection, preview, history, download, admin dashboard.
- **AI Service:** Has an `aiService` but it's not correctly used. An old implementation with `axios` is present in `HomeScreen`.

## 2. Remodeling Plan

### Phase 1: Core Functionality and UI

- [X] **Setup Project Structure:** Reorganized the mobile app's `src` folder by moving shared code to `types.ts` and `utils/validation.ts`.
- [X] **Implement UI Foundation:**
  - [X] Replicate the web app's `Layout` component, including header and navigation.
  - [X] Implement dark mode support.
  - [X] Copy logos, favicons, and other assets from the web app to the mobile app.
  - [X] Implemented a TabNavigator for the main screens.
- [X] **Replicate Resume Creation Flow:**
  - [X] Implement the multi-step resume creation flow from the web app's `Editor.tsx`.
  - [X] Create or adapt the following components for React Native:
    - [X] `MethodSelector.tsx` - Created React Native version matching web app UI
    - [X] `ResumeWizard.tsx` - Implemented full 6-step wizard as in web app
    - [X] `DocumentUpload.tsx` - Enhanced with proper upload and parsing functionality
    - [X] `TemplateSelector.tsx` - Created React Native version for template selection
- [X] **Fix AI Generation:**
  - [X] Remove the `axios` call from `HomeScreen.tsx`.
  - [X] Integrate the `aiService.ts` correctly into the `OptimizationScreen.tsx` (or the new `Editor` screen).
  - [X] Ensure the AI generation is done on the client-side using the Google AI SDK.

### Phase 1.5: Supabase and Data Consistency

- [X] **Fix Supabase Schema Inconsistency:**
  - [X] Update mobile app to use same table names as web app (`resumes` instead of `mobile_resumes`)
  - [X] Ensure all Supabase queries and mutations match web app exactly
  - [X] Update the mobile app's schema to match the web app's resume data structure

### Phase 2: Feature Parity

- [X] **Implement Complete Resume Creation Flow:**
  - [X] Implement the 6-step Resume Wizard like the web app
  - [X] Add proper MethodSelector with "Create from Scratch" and "Upload Document" options
  - [X] Implement Template Selection functionality matching the web app
  - [X] Integrate all components into a seamless workflow
- [X] **Implement Resume History:** Create a `HistoryScreen` to display a list of saved resumes matching the web app.
- [X] **Implement Resume Preview:** Create a `PreviewScreen` to display the generated resume.
- [X] **Implement Document Parsing:** Enhanced existing component with proper functionality for PDF, DOCX, TXT files.
- [X] **Implement Resume Download:**
  - [X] Implement functionality to download the resume as a PDF.
  - [X] Implement functionality to download the resume as a DOCX.

### Phase 3: Authentication and Admin

- [X] **Implement Full Authentication Flow:**
  - [X] Replicate the user login/signup flow from the web app's `Auth.tsx`.
  - [X] Ensure the app navigates correctly after login/logout.
- [X] **Implement Admin Section:**
  - [X] Create an `AdminLoginScreen`.
  - [X] Create an `AdminDashboardScreen` to display usage metrics (updated to use the same Supabase RPC function as web app).

## 3. Progress Tracking

### Completed Tasks:
- [X] **Resume Creation Flow:** Full 6-step wizard implemented with MethodSelector, ResumeWizard, and TemplateSelector
- [X] **Supabase Schema Alignment:** Mobile app now uses same table names and structure as web app
- [X] **Data Consistency:** Both apps now use identical data models and storage approach
- [X] **Component Parity:** All major UI components created/matched with web app equivalents
- [X] **Authentication Flow:** Login/Signup functionality matches web app behavior
- [X] **History and Preview:** Screens updated to match web app functionality
- [X] **Admin Dashboard:** Updated to use same data source as web app
- [X] **PDF/DOCX Download:** Full download functionality implemented using expo-print for proper PDF generation

### Remaining Tasks:
- [ ] None - All major features now match web app functionality

The mobile app now has complete feature parity with the web app in terms of UI, workflow, and data handling, with consistent user experience across both platforms.

---
