# WellMed Patient Intake & Data Analytics App 🏥📱

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

A cross-platform mobile and web application built for **WellMed Specialist Centre** to streamline patient registration, medical assessment, and data management. Patients can scan a QR code to fill out forms on their own devices, while clinic staff can view, filter, and export patient data via a real-time admin dashboard.

> **Note:** This is a portfolio showcase of a real production deployment. The live database is credential-protected — no patient data is publicly accessible.

---

## 🌟 Key Features

- **📱 Universal Compatibility** — Fully responsive across Android, iOS, and Web browsers.
- **🔗 QR-Code Patient Intake** — Generates a QR code linking patients directly to a mobile-friendly intake form on their own device.
- **⚡ Real-Time Data Sync** — Firebase Firestore streams patient submissions to the admin dashboard instantly.
- **📊 Live Admin Dashboard** — Real-time counters for total, daily, and yesterday's patients. Includes multi-parameter search (name/phone) and date filters.
- **📄 PDF Report Export** — Compiles filtered patient records into a formatted PDF using native print APIs.
- **⌨️ Native UX Optimizations** — Keyboard-avoiding views, platform-specific alert handling, and clean form validation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (SDK 54) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Database | Firebase Cloud Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| PDF | expo-print + expo-sharing |
| QR Code | react-native-qrcode-svg |

---

## 🔒 Security

This project follows security best practices for a production deployment:

- All credentials (Firebase API keys, admin login) are stored in a local `.env` file — **never committed to version control**.
- Firestore Security Rules enforce that **only authenticated admin sessions can read patient data**.
- Patients submitting forms are unauthenticated — they can only write new records, never read or modify existing ones.
- See `.env.example` for the required environment variable structure.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/go) app on your phone (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Avishka889/data-collector-app.git
   cd data-collector-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to a new `.env` file:
   ```bash
   cp .env.example .env
   ```

   Fill in your own Firebase project credentials and admin account:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   EXPO_PUBLIC_ADMIN_EMAIL=your_admin@email.com
   EXPO_PUBLIC_ADMIN_PASSWORD=your_admin_password
   ```

   > Get Firebase credentials from: [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your apps → SDK setup.

4. **Start the development server**
   ```bash
   npx expo start
   ```
   - Press `w` for Web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR with Expo Go for your physical phone

---

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx         # Patient data entry screen
│   │   ├── dashboard.tsx     # Admin dashboard (auth-protected)
│   │   └── qr.tsx            # QR code generator screen
│   ├── _layout.tsx           # Root layout
│   └── patient-form.tsx      # Standalone patient form (web-optimised)
├── assets/                   # Images and icons
├── components/               # Reusable UI components
├── constants/                # App-wide theme and constants
├── hooks/                    # Custom React hooks
├── firebaseConfig.ts         # Firebase init (reads from .env)
├── firestore.rules           # Firestore security rules
├── .env.example              # Environment variable template
└── package.json
```

---

## 📄 License

Built for **WellMed Specialist Centre** as a real-world patient data collection and analytics solution.
