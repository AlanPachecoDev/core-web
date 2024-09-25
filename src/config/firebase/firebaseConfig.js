import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import router from "../../router/index.js";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FB_APIKEY}`,
  authDomain: `${import.meta.env.VITE_FB_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FB_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FB_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FB_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FB_APP_ID}`,
  measurementId: `${import.meta.env.VITE_FB_MEASUREMENT_ID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const authFirebase = getAuth(app);

onAuthStateChanged(authFirebase, async (user) => {
  // if (user) {
  //   // El usuario está autenticado
  //   // Aquí puedes acceder a la información del usuario en el objeto `user`
  //   console.log("Usuario autenticado:", user.uid);

  //   const response = await fetch(
  //     `http://localhost:3000/users/user/${user.uid}`
  //   );
  //   // Verificar si la respuesta es exitosa
  //   if (response.ok) {
  //     const data = await response.json();

  //     user = {
  //       isAdmin: data.isAdmin,
  //     };
  //   }
  //   console.log("this.$route.path: ", window.location.pathname);
  //   if (window.location.pathname == "/auth") {
  //     if (user.isAdmin == true) {
  //       router.push("/homeAdmin");
  //     } else {
  //       router.push("/");
  //     }
  //   }
  // } else {
  //   // El usuario no está autenticado
  //   console.log("Usuario no autenticado");
  //   //Si el usuario no está autenticado lo redirige automáticamente a la pestaña de inicio
  //   router.push("/auth");
  // }
  
});

export { app, authFirebase, signInWithEmailAndPassword };
