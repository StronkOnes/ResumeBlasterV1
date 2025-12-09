# Resume Blaster Mobile App - Setup and Build Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the App Locally](#running-the-app-locally)
5. [Building for Production](#building-for-production)
6. [Server Setup](#server-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the Resume Blaster mobile app, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** tools
- **Android Studio** (for Android builds)
- **Xcode** (for iOS builds, macOS only)

## Project Setup

### 1. Clone or Access the Project

The project is structured as follows:
```
MobileApp/
├── mobile/                    # Expo app root
├── shared/                   # Shared business logic
├── server/                   # Server-side endpoints
└── README.md                 # Main documentation
```

### 2. Install Mobile App Dependencies

Navigate to the mobile directory and install all required dependencies:

```bash
cd MobileApp/mobile

# Install dependencies
npm install

# Install additional Expo packages
npx expo install expo-file-system expo-sharing expo-linking expo-constants expo-document-picker
npx expo install react-native-gesture-handler react-native-safe-area-context react-native-screens
npx expo install @react-navigation/native @react-navigation/native-stack

# Install other dependencies
npm install @supabase/supabase-js axios react-native-url-polyfill react-native-get-random-values
```

### 3. Install Server Dependencies

If you're planning to run the server locally:

```bash
cd MobileApp/server
npm install
```

## Environment Configuration

Create a `.env` file in the `MobileApp/mobile/` directory with your configuration:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from the Project Settings → API
4. Update the `.env` file with these values

### Database Schema

You'll need to set up the following tables in your Supabase project:

1. `profiles` table for user information:
```
id - UUID (Primary Key, References auth.users)
full_name - TEXT
email - TEXT
updated_at - TIMESTAMP
created_at - TIMESTAMP
```

2. `resumes` table for storing resumes:
```
id - UUID (Primary Key, Default: gen_random_uuid())
user_id - UUID (References profiles.id)
full_name - TEXT
email - TEXT
phone - TEXT
address - TEXT
summary - TEXT
sections - JSON
created_at - TIMESTAMP
updated_at - TIMESTAMP
```

## Running the App Locally

### 1. Start the Mobile App

```bash
# Navigate to the mobile directory
cd MobileApp/mobile

# Start the development server
npx expo start
```

This will open the Expo Dev Tools in your browser. You can then run the app on:

- **Android device/emulator**: Press 'a' in the terminal
- **iOS device/simulator**: Press 'i' in the terminal
- **Web**: Press 'w' in the terminal

### 2. Running on Physical Device

1. Install the "Expo Go" app on your iOS or Android device
2. Run `npx expo start` in the mobile directory
3. Scan the QR code shown in the terminal or browser

## Server Setup

### 1. Start the Server

For the DOCX generation functionality to work, you need to run the server:

```bash
cd MobileApp/server
npm start
```

### 2. Update Server URL in Mobile App

When testing the app, you'll need to update the server URL in `HomeScreen.tsx` to match your server's address:

```typescript
// In MobileApp/mobile/src/screens/HomeScreen.tsx
const SERVER_URL = 'http://your-server-ip:3000'; // Use your actual IP address
```

Note: When using an emulator, you may need to use your machine's IP address instead of `localhost`.

## Building for Production

### 1. Install EAS CLI

EAS Build is Expo's service for building app binaries in the cloud.

```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS Build

Create an `eas.json` file in the mobile directory:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Build for Android (APK/AAB)

#### For APK (for testing):
```bash
cd MobileApp/mobile
eas build --platform android --profile preview
```

#### For AAB (for Google Play Store):
```bash
cd MobileApp/mobile
eas build --platform android --profile production
```

### 4. Build for iOS

```bash
cd MobileApp/mobile
eas build --platform ios --profile production
```

### 5. Local Builds (Alternative to EAS)

If you prefer to build locally:

#### Android:
```bash
# Create a development build for testing
eas build --platform android --profile development --local

# Or use classic build process
npx expo run:android --variant release
```

## Testing the App

### 1. Unit Tests
Add Jest testing configuration to test your components and logic:

```bash
npm install --save-dev jest @types/jest react-test-renderer
```

### 2. Manual Testing Checklist

Before building for production, test the following:

- [ ] User authentication (sign up, sign in, sign out)
- [ ] Resume creation and editing
- [ ] Resume preview functionality
- [ ] DOCX generation and download
- [ ] File sharing functionality
- [ ] Offline mode (if implemented)
- [ ] All navigation flows
- [ ] Error handling
- [ ] Form validation

## Deployment

### 1. Deploying the Server

The server component needs to be deployed to a service that can handle file generation and serve the generated DOCX files. Options include:

- **Vercel**: Easy deployment for Node.js applications
- **Railway**: Great for Node.js applications with easy database integration
- **AWS**: More complex but very scalable
- **Supabase Functions**: If you're already using Supabase

### 2. Publishing to App Stores

#### Google Play Store
- Generate an AAB file using EAS Build
- Create a developer account on Google Play Console
- Follow Google's publishing guidelines

#### Apple App Store
- Generate an IPA file using EAS Build
- Enroll in the Apple Developer Program
- Follow Apple's App Store guidelines

## Troubleshooting

### Common Issues

#### 1. "Unable to resolve module" errors
- Run `npx expo install --fix` to fix dependency issues
- Clear cache: `npx expo start --clear`

#### 2. File generation not working
- Verify server is running and accessible
- Check network permissions in `app.json`
- Ensure correct server URL in mobile app

#### 3. Authentication issues
- Verify Supabase credentials
- Check that auth settings allow signups
- Ensure redirect URLs are configured correctly for OAuth

#### 4. Build failures
- Ensure you have the latest version of EAS CLI
- Check that your build configuration is correct
- Look at build logs on the EAS dashboard for specific errors

### Debugging Tips

- Use React Native Debugger for debugging
- Check device logs: `adb logcat` for Android, Console app for iOS
- Use Flipper for complex debugging scenarios
- Enable remote debugging in Expo

## Maintenance and Updates

### Keeping Dependencies Updated

Regularly update your dependencies:

```bash
# Check for outdated packages
npm outdated

# Update Expo SDK
npx expo install --fix
```

### Monitoring Performance

- Monitor app size during builds
- Test on various device sizes and performance capabilities
- Monitor crash reports and error logs
- Collect user feedback on performance

## Support

For help with the Resume Blaster mobile app:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Look up React Native issues in the [official docs](https://reactnative.dev/docs/getting-started)
3. For Supabase issues, consult the [Supabase documentation](https://supabase.com/docs)
4. If you encounter specific issues with this app, create an issue in the project repository

---

**Note**: This project was built with security in mind, with sensitive operations handled server-side and proper authentication implemented. Always ensure that API keys and sensitive information are properly managed and not exposed in client code.