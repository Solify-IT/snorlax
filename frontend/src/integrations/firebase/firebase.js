import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

  var firebaseConfig = {
    apiKey: "AIzaSyChW283qIcc2XEKW4SW0l3Mc5YX221DfGk",
    authDomain: "snlx-1e30c.firebaseapp.com",
    projectId: "snlx-1e30c",
    storageBucket: "snlx-1e30c.appspot.com",
    messagingSenderId: "326544207814",
    appId: "1:326544207814:web:012f9d346e98c4be598cc7",
    measurementId: "G-GKE3EWSBJM"
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var firebaseConfig = {
//     apiKey: "AIzaSyChW283qIcc2XEKW4SW0l3Mc5YX221DfGk",
//     authDomain: "snlx-1e30c.firebaseapp.com",
//     projectId: "snlx-1e30c",
//     storageBucket: "snlx-1e30c.appspot.com",
//     messagingSenderId: "326544207814",
//     appId: "1:326544207814:web:012f9d346e98c4be598cc7",
//     measurementId: "G-GKE3EWSBJM"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>