# TaskForge Setup Guide
## React Native CLI + Firebase + Redux Toolkit

---

## 1. Prerequisites

| Tool | Min Version | Install |
|------|-------------|---------|
| Node.js | 18+ | https://nodejs.org |
| Watchman | Any | `brew install watchman` |
| Xcode | 15+ | Mac App Store |
| Android Studio | Hedgehog+ | https://developer.android.com/studio |
| CocoaPods | 1.14+ | `sudo gem install cocoapods` |
| JDK | 17 | `brew install --cask zulu@17` |

---

## 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**
2. Name it `TaskForge` (or any name you like)
3. **Authentication**: Enable **Email/Password** provider
   - Console → Authentication → Sign-in methods → Email/Password → Enable
4. **Firestore**: Create database in **production mode**
   - Console → Firestore Database → Create database → Start in production mode → Choose region

### Firestore Security Rules

Paste this in **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 3. Download Config Files

### iOS
- Console → Project Settings → iOS → Add app → Bundle ID: `com.taskforge`  
- Download `GoogleService-Info.plist`  
- Place at: `ios/TaskForge/GoogleService-Info.plist`

### Android
- Console → Project Settings → Android → Add app → Package name: `com.taskforge`
- Download `google-services.json`
- Place at: `android/app/google-services.json`

---

## 4. Update Firebase Config

Open `src/services/firebase.ts` and replace the placeholder config object with your actual values from:  
**Firebase Console → Project Settings → Your apps → Web App → Config**

---

## 5. Install & Initialize React Native Project

Since this is a React Native CLI project (not Expo), you need to scaffold it first:

```bash
# 1. Navigate to the project folder
cd /path/to/TaskForge_Claude_Prompt

# 2. Initialize the React Native project (this creates ios/ android/ etc.)
npx react-native@0.76.5 init TaskForge --template react-native-template-typescript --directory .

# 3. Replace App.tsx with the one we created (the init will overwrite it)
# The files in src/ are safe; only App.tsx at root gets overwritten by init

# 4. Install all npm dependencies
npm install

# 5. iOS — install CocoaPods
cd ios && pod install && cd ..
```

---

## 6. Android Setup

In `android/build.gradle` make sure you have:
```groovy
// Top-level build.gradle
classpath 'com.google.gms:google-services:4.4.2'
```

In `android/app/build.gradle`:
```groovy
apply plugin: 'com.google.gms.google-services'
```

---

## 7. Run the App

### iOS Simulator
```bash
npx react-native run-ios
```

### Android Emulator (start it first from Android Studio)
```bash
npx react-native run-android
```

### Start Metro bundler manually (in a separate terminal)
```bash
npx react-native start
```

---

## 8. Project Structure Summary

```
TaskForge_Claude_Prompt/
├── App.tsx                         ← Root component
├── package.json
├── tsconfig.json
├── babel.config.js
└── src/
    ├── assets/
    │   └── theme.ts                ← Design system (colors, typography, spacing)
    ├── types/
    │   └── index.ts                ← Task, User, Priority, Category types
    ├── services/
    │   ├── firebase.ts             ← Firebase init
    │   ├── authService.ts          ← Auth helpers
    │   └── taskService.ts          ← Firestore CRUD
    ├── store/
    │   ├── index.ts                ← Redux store
    │   └── slices/
    │       ├── authSlice.ts        ← Auth state + thunks
    │       └── tasksSlice.ts       ← Tasks state + thunks
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useTasks.ts
    ├── utils/
    │   ├── sortTasks.ts            ← Smart sort algorithm
    │   ├── formatDate.ts
    │   └── validators.ts
    ├── components/
    │   ├── TaskCard.tsx            ← Animated task card
    │   ├── AuthInput.tsx
    │   ├── GradientButton.tsx
    │   ├── PrioritySelector.tsx
    │   ├── CategorySelector.tsx
    │   ├── FilterBar.tsx
    │   └── EmptyState.tsx
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── AddTaskScreen.tsx
    │   └── ProfileScreen.tsx
    └── navigation/
        ├── AuthStack.tsx
        ├── AppStack.tsx
        └── RootNavigator.tsx
```

---

## 9. Key Architecture Decisions

| Decision | Why |
|----------|-----|
| **`@react-native-firebase`** (native SDK) vs JS SDK | Native offers better perf, offline support, and push notifications |
| **`onAuthStateChanged` in RootNavigator** | Single source of truth for auth, persists across app restarts |
| **Redux + createAsyncThunk** | Predictable state, easy debugging, typed async flows |
| **Smart sort as pure function** | Unit-testable, no side effects, easily adjustable weights |
| **Animated API (not Reanimated)** | Zero extra deps; good enough for card entrance + toggle animations |

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| Metro bundler port conflict | `npx react-native start --reset-cache` |
| Firebase not initialized | Check `google-services.json` / `GoogleService-Info.plist` placement |
| iOS pods error | `cd ios && pod deintegrate && pod install` |
| Android build failure | `cd android && ./gradlew clean` then rebuild |
| auth/network-request-failed | Check your Firebase config API key and project ID |
