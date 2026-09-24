/* ============================================================
   FIREBASE SETUP — do this once, it's free.

   1. Go to https://console.firebase.google.com → "Add project"
      → give it any name → finish creating it.
   2. In your new project: click the </> (web) icon to add a Web App.
      Give it a nickname, click "Register app". It will show you a
      firebaseConfig object — copy the values into FIREBASE_CONFIG below.
   3. In the left menu: Build → Authentication → "Get started"
      → Sign-in method tab → enable "Google".
   4. In the left menu: Build → Firestore Database → "Create database"
      → start in "production mode" → pick any location.
   5. Still in Firestore, click the "Rules" tab, delete everything there,
      and paste in the contents of firestore-rules.txt (included with
      these files), then click "Publish".
   6. Upload index.html, style.css, script.js, admin.html and this file
      to your web host (or open admin.html locally to test).
   ============================================================ */

export const FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

// Only this Gmail address is allowed to use the admin dashboard.
export const ADMIN_EMAIL = "visaldy1@gmail.com";
  
