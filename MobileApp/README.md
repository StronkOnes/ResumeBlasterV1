# Resume Blaster Mobile App

A mobile application for creating and managing professional resumes, built with React Native and Expo.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Server Setup](#server-setup)

## Features
- Create and edit professional resumes
- Generate DOCX resume files
- Mobile-optimized UI/UX
- Cross-platform compatibility (iOS & Android)
- Secure authentication with Supabase
- Offline capability for basic functionality

## Tech Stack
- React Native
- Expo SDK 50+
- TypeScript
- React Navigation
- Supabase for authentication and data
- docx for document generation
- Axios for API calls

## Project Structure
```
MobileApp/
├── mobile/                    # Expo app root
│   ├── App.tsx               # Main app entry point
│   ├── app.json              # Expo configuration
│   ├── assets/               # Images and other assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── services/         # API and business logic services
│   │   └── navigation/       # Navigation setup
│   ├── node_modules/
│   └── package.json
├── shared/                   # Shared business logic
│   ├── types.ts              # Type definitions
│   ├── resumeService.ts      # Resume generation logic
│   └── validation.ts         # Input validation logic
├── server/                   # Server-side endpoints
│   ├── generate-docx.ts      # DOCX generation endpoint
│   └── package.json          # Server dependencies
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI tools

### 1. Install Dependencies
```bash
cd MobileApp/mobile
npm install
```

### 2. Install Additional Dependencies
```bash
# Navigate to mobile directory
cd MobileApp/mobile

# Install additional packages
npx expo install expo-file-system expo-sharing expo-linking expo-constants expo-document-picker
npm install @supabase/supabase-js axios react-native-url-polyfill react-native-get-random-values
```

### 3. Server Setup
The mobile app requires a backend server to generate DOCX files. See [Server Setup](#server-setup) section for instructions.

## Development

### 1. Running the App
```bash
cd MobileApp/mobile

# Run on Android
npm run android

# Run on iOS (requires macOS)
npm run ios

# Run on web for testing UI components
npm run web
```

### 2. Using Expo Go
1. Install Expo Go app on your mobile device
2. Run `npx expo start` in the mobile directory
3. Scan the QR code displayed in the terminal

## Building for Production

### Android (APK/AAB)
```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Log in to Expo account
eas login

# Build for Android
eas build --platform android
```

### iOS (IPA)
```bash
# Build for iOS
eas build --platform ios
```

### Generate Local Builds
If you prefer to create local builds without EAS:

#### Android
```bash
# For APK
npx expo run:android --variant release

# Then build APK
cd android
./gradlew assembleRelease
```

## Server Setup

The Resume Blaster mobile app requires a backend server to generate DOCX files and process AI resume optimization. The server is located in the `server/` directory.

### 1. Navigate to Server Directory
```bash
cd MobileApp/server
```

### 2. Install Server Dependencies
```bash
npm install
```

### 3. Configure Server Environment Variables
Create a `.env` file in the server directory with your API keys:
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file and add your Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

### 5. Update Server URL in Mobile App
The mobile app uses the `EXPO_PUBLIC_SERVER_URL` environment variable to connect to the backend. Make sure this is properly set in your mobile app's `.env` file before testing.

## Environment Variables

Create a `.env` file in the mobile directory with the following variables:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SERVER_URL=your_server_url
```

**Note**: API keys are NOT stored in the mobile app for security reasons. All AI processing is handled securely via the backend server.

## Testing

### Unit Tests
```bash
cd MobileApp/mobile
npm test
```

### Running on Physical Device
For better testing of file operations and sharing functionality, use a physical device:
1. Install Expo Go on your device
2. Run `npx expo start`
3. Scan the QR code with Expo Go

## Deployment

### App Store Deployment
1. Build your app using EAS
2. Follow platform-specific guidelines
3. Submit to App Store (iOS) and Google Play Store (Android)

## Troubleshooting

### Common Issues
- If you encounter issues with file operations on iOS simulator, test on a physical device
- File sharing might not work on simulators; test on real devices
- Network requests may not work with `localhost` on mobile; use your machine's IP address

### Updating Expo
```bash
npx expo install --fix
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)