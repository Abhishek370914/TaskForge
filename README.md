# ⚡ TaskForge

> A production-grade React Native To-Do app with Firebase Auth, Firestore, Redux Toolkit, and a **Dark Glassmorphism + Neon Accent** design.

![React Native](https://img.shields.io/badge/React_Native-0.84.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-20.x-FFCA28?logo=firebase)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux)

---

## 📱 Features

| Feature | Details |
|---------|---------|
| **Auth** | Email/password register & login, persistent sessions, logout |
| **Tasks** | Create, complete, delete; title, description, deadline, priority, category |
| **Smart Sort** | Weighted score = priority × 0.5 + urgency × 0.35 + recency × 0.15 |
| **Filters** | Status (All / Active / Done), Category, Sort order |
| **Animations** | Fade+slide entrance, scale-pulse complete toggle, slide-out delete |
| **Dark UI** | Glassmorphism cards, neon accent (#6C63FF), linear-gradient buttons |
| **Profile** | Stats grid, completion progress bar, sign-out |

---

## 🗂 Project Structure

```
TaskForge/
├── App.tsx                        ← Redux Provider → RootNavigator
├── index.js                       ← RN entry point
├── src/
│   ├── assets/theme.ts            ← Design system (colors, spacing, typography)
│   ├── types/index.ts             ← Task, User, Priority, Category types
│   ├── services/
│   │   ├── firebase.ts            ← Firebase init (add your config here)
│   │   ├── authService.ts         ← register / login / logout / onAuthStateChanged
│   │   └── taskService.ts         ← Firestore CRUD
│   ├── store/
│   │   ├── index.ts               ← Redux store
│   │   └── slices/
│   │       ├── authSlice.ts       ← Auth state + async thunks
│   │       └── tasksSlice.ts      ← Tasks state + async thunks
│   ├── hooks/
│   │   ├── useAuth.ts             ← Auth state + actions
│   │   └── useTasks.ts            ← Filtered/sorted tasks via useMemo
│   ├── utils/
│   │   ├── sortTasks.ts           ← Smart sort algorithm (pure function)
│   │   ├── formatDate.ts          ← Relative deadline formatting
│   │   └── validators.ts          ← Form validators
│   ├── components/
│   │   ├── TaskCard.tsx           ← Animated task card
│   │   ├── GradientButton.tsx     ← LinearGradient CTA button
│   │   ├── AuthInput.tsx          ← Styled text input
│   │   ├── PrioritySelector.tsx   ← Low / Medium / High pill picker
│   │   ├── CategorySelector.tsx   ← Horizontal category chip scroller
│   │   ├── FilterBar.tsx          ← Status + category + sort controls
│   │   └── EmptyState.tsx         ← Empty list illustration
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx         ← Task list with header & FAB
│   │   ├── AddTaskScreen.tsx      ← Full task creation form
│   │   └── ProfileScreen.tsx      ← User info, stats, logout
│   └── navigation/
│       ├── AuthStack.tsx          ← Login ↔ Register
│       ├── AppStack.tsx           ← Bottom tabs + custom tab bar
│       └── RootNavigator.tsx      ← Auth gate via onAuthStateChanged
```

---

## 🛠 Prerequisites

| Tool | Min Version | Install |
|------|-------------|---------|
| Node.js | 22+ | https://nodejs.org |
| Watchman | Any | `brew install watchman` |
| Xcode | 15+ | Mac App Store |
| Android Studio | Hedgehog+ | https://developer.android.com/studio |
| CocoaPods | 1.14+ | `sudo gem install cocoapods` |
| JDK | 17 | `brew install --cask zulu@17` |

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project** → name it `TaskForge`
2. **Authentication** → Sign-in methods → **Email/Password** → Enable
3. **Firestore Database** → Create database → Start in **production mode**

### Firestore Security Rules
Go to **Firestore → Rules** and paste:
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

### Config Files
| Platform | File | Location in project |
|----------|------|---------------------|
| iOS | `GoogleService-Info.plist` | `ios/TaskForgeScaffold/` |
| Android | `google-services.json` | `android/app/` |

Download these from **Firebase Console → Project Settings → Your apps**.

### Update Firebase credentials
Open `src/services/firebase.ts` and replace the placeholder values with your actual Firebase project config:
```ts
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

---

## 🚀 Installation & Running

### 1. Clone the repo
```bash
git clone https://github.com/Abhishek370914/TaskForge.git
cd TaskForge
```

### 2. Install dependencies
```bash
npm install
```

### 3. iOS — install CocoaPods
```bash
cd ios && pod install && cd ..
```

### 4. Add Firebase config files *(see Firebase Setup above)*

### 5. Run the app

**Start Metro bundler** (Terminal 1):
```bash
npm start
```

**Run on iOS** (Terminal 2):
```bash
npm run ios
# or
npx react-native run-ios
```

**Run on Android** (start an emulator first, then Terminal 2):
```bash
npm run android
# or
npx react-native run-android
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.84 (CLI) + TypeScript |
| Auth & DB | Firebase Auth + Firestore (`@react-native-firebase`) |
| State | Redux Toolkit + React-Redux |
| Navigation | React Navigation v6 (Native Stack + Bottom Tabs) |
| Animations | React Native Animated API |
| Date picker | `react-native-modal-datetime-picker` |
| Dates | `date-fns` |
| Gradients | `react-native-linear-gradient` |

---

## 🧠 Smart Sort Algorithm

Tasks are scored and ranked using a weighted formula:

```
score = (priority_weight × 0.5) + (deadline_urgency × 0.35) + (created_recency × 0.15)
```

| Component | Formula |
|-----------|---------|
| `priority_weight` | High=1.0, Medium=0.5, Low=0.0 (normalised) |
| `deadline_urgency` | `1 - min(hoursUntilDeadline, 72) / 72` |
| `created_recency` | `1 - min(ageHours, 168) / 168` |

Pure function in [`src/utils/sortTasks.ts`](src/utils/sortTasks.ts).

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Metro bundler port conflict | `npx react-native start --reset-cache` |
| `GoogleService-Info.plist` missing | Download from Firebase Console and place in `ios/TaskForgeScaffold/` |
| `google-services.json` missing | Download from Firebase Console and place in `android/app/` |
| iOS pods error | `cd ios && pod deintegrate && pod install` |
| Android build failure | `cd android && ./gradlew clean` then rebuild |
| `auth/network-request-failed` | Check your Firebase API key and project ID |
| Blank white screen | Check Firebase config — app may be crashing silently |

---

## 📄 License

MIT © 2026 Abhishek