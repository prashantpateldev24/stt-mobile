# Smart Task Tracker 👋

A modern, offline-first React Native application built with Expo SDK 54, TanStack Query, and MMKV for high-performance task and habit tracking.

## 📺 Demo

[![Demo Video](https://img.shields.io/badge/Demo-Video-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1GV7E9cXCvHyf49WY14adii3SSckukp-G/view)

## 🚀 Features

- **Task Management**: Create, edit, and delete tasks with priority levels.
- **Habit Tracking**: Track daily habits with automated streak management.
- **Offline First**: Full offline support with optimistic UI updates and background synchronization.
- **Secure Auth**: Email/OTP based authentication flow.
- **Modern UI**: Built with React Native components and premium design aesthetics.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) or [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Watchman](https://facebook.github.io/watchman/docs/install) (for macOS users)

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-task-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file from the example:
```bash
cp .env.example
```
Update `EXPO_PUBLIC_API_URL` in `.env` with your backend server URL (e.g., `http://localhost:4000`).

## 🏗️ Development Build (Required)

This project uses **`react-native-mmkv`**, which contains native code. Therefore, it **cannot run in Expo Go**. You must use a Development Build or Prebuild the project.

### Step 1: Prebuild the project
This generates the `ios` and `android` native directories.
```bash
npx expo prebuild
```

### Step 2: Run on Simulator/Emulator
This will install the development build on your device or emulator.

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## 🖥️ Project Structure

- `src/app`: File-based routing (Expo Router).
- `src/components`: Reusable UI and Form components.
- `src/features`: Feature-based modules (Auth, Tasks, Habits, Offline).
- `src/services`: API clients and Query configuration.
- `src/storage`: Local persistence logic (MMKV).
- `src/utils`: Helper functions and error handling.

## 📜 Available Scripts

- `npm start`: Starts the Expo development server.
- `npm run ios`: Runs the app on iOS simulator (Prebuild required).
- `npm run android`: Runs the app on Android emulator (Prebuild required).
- `npm run lint`: Runs ESLint to check code quality.
- `npm run format`: Formats code using Prettier.

## 🧪 Development Notes

- **Offline Sync**: Actions performed while offline are enqueued and automatically synced when the connection is restored.
- **MMKV**: Used for fast, synchronous storage of auth tokens and small state pieces.
- **TanStack Query**: Handles server state, caching, and optimistic updates.
