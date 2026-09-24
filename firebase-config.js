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
  apiKey: "AIzaSyAUhiBcjfNJnCFDqZahUXQxp7ghxb6xWBU",
  authDomain: "negotiation-46372.firebaseapp.com",
  projectId: "negotiation-46372",
  storageBucket: "negotiation-46372.firebasestorage.app",
  messagingSenderId: "1013471011085",
  appId: "1:1013471011085:web:bc79da025c1af961c51044",
};

// Only this Gmail address is allowed to use the admin dashboard.
export const ADMIN_EMAIL = "visaldy1@gmail.com";
  
