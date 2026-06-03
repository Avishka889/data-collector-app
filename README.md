# WellMed Patient Intake & Data Analytics App 🏥📱

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

A cross-platform mobile and web application built for **WellMed Specialist Centre** to streamline patient registration, medical assessment, and data management. Patients can scan a QR code to fill out forms on their own devices, while clinic staff can view, filter, and export patient data via a real-time admin dashboard.

---

## 🌟 Key Features

*   **📱 Universal Compatibility:** Fully responsive layout working seamlessly across Android, iOS, and Web browsers.
*   **🔗 QR-Code Intake Workflow:** Generates a custom QR code linking patients directly to a secure, mobile-friendly intake form.
*   **⚡ Real-Time Data Sync:** Integrates with Firebase Firestore to sync and stream patient submissions to the clinic dashboard instantly.
*   **📊 Live Clinic Dashboard:** Shows real-time counters for total, daily, and critical patients with multi-parameter search (Name/Phone) and status filters.
*   **📄 PDF Report Generator:** Instantly compiles filtered patient records into a formatted PDF document using native print APIs for exporting and sharing.
*   **⌨️ Native UX Optimizations:** Handles native keyboard avoiding states, platform-specific alert handling, and clean form validation.

---

## 🛠️ Tech Stack & Tools

*   **Frontend Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 54)
*   **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
*   **Database:** [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **Libraries & APIs:**
    *   `react-native-qrcode-svg` for QR code rendering.
    *   `expo-print` & `expo-sharing` for dynamic PDF generation and native file sharing.
    *   `xlsx` for spreadsheet parsing and exporting capabilities.

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites

Make sure you have Node.js installed. We recommend using LTS version.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Firebase Config**
    Create or edit `firebaseConfig.ts` in the root directory and add your Firebase project credentials:
    ```typescript
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    ```

4.  **Start the Expo Server**
    ```bash
    npx expo start
    ```

    *   Press `a` to run on an Android Emulator.
    *   Press `i` to run on an iOS Simulator.
    *   Press `w` to run on a Web Browser.

---

## 📁 Project Structure

```text
├── app/                  # Application screens (Expo Router)
│   ├── (tabs)/           # Main tab bar navigation screens
│   │   ├── index.tsx     # Patient Data Entry screen
│   │   ├── dashboard.tsx # Clinic Admin Dashboard screen
│   │   └── qr.tsx        # QR Code Generator screen
│   ├── _layout.tsx       # Root layout file
│   └── patient-form.tsx  # Standalone patient registration form (Web-friendly)
├── assets/               # Local images, icons, and fonts
├── components/           # Reusable UI components
├── firebaseConfig.ts     # Firebase initialisation config
├── firestore.rules       # Security rules for Cloud Firestore
└── package.json          # Project dependencies & scripts
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
