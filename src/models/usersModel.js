import {
  authFirebase,
  signInWithEmailAndPassword,
} from "../config/firebase/firebaseConfig";
import axios from "axios";
//Ruta para la api
const RUTA_SERVIDOR = `${import.meta.env.VITE_APP_RUTA_API}`;
import { useUserStore } from "../stores/userStore.js";
//CREATE
async function createUser(userData) {
  try {
    const { email, name, surname, birthdate, city, password, isAdmin } =
      userData;

    const response = await fetch(`${RUTA_SERVIDOR}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        surname,
        birthdate,
        city,
        password,
        isAdmin,
      }),
    });

    //Si la respuesta no es satisfactoria
    if (!response.ok) {
      throw new Error("Error creating user.");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
}

async function sendEmail(to, subject, text) {
  try {
    console.log("TOOO: ", to);
    const response = await fetch(`${RUTA_SERVIDOR}/users/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, text }),
    });

    //Si la respuesta no es satisfactoria
    if (!response.ok) {
      throw new Error("Error sending mail.");
    }

    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
}

async function signIn(userData) {
  try {
    const { email, password } = userData;

    const res = await signInWithEmailAndPassword(authFirebase, email, password);

    const user = res.user;

    const uid = user.uid;

    const resApi = await fetch(`${RUTA_SERVIDOR}/users/user/${uid}`);

    // Comprueba si la respuesta de la API es exitosa
    if (resApi.ok) {
      // Parsea la respuesta a JSON
      let userData = await resApi.json();

      // Retornar el usuario para que pueda ser utilizado en la lógica de la aplicación
      return userData;
    } else {
      throw new Error("¡Unknow Error!");
    }
  } catch (error) {
    throw error;
  }
}

async function signOut() {
  try {
    // Llamar a la función de signOut proporcionada por Firebase Authentication
    await authFirebase.signOut();
    return true;
  } catch (error) {
    // Manejo de errores en caso de fallo al cerrar sesión
    throw error;
  }
}

async function signOutGoogle() {
  try {
    // Cerrar la sesión en Google
    // google.accounts.id.disableAutoSelect();

    //google.accounts.id.cancel();
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke();
    google.accounts.id.renderButton();
    return true;
    // //recargar la página (hará que mi código detecte que no hay usuario y por ende lo rediriga al auth)
    // location.reload();
    // // Abrir la URL de cierre de sesión en una nueva pestaña
    // var signOutTab = window.open(signOutUrl, "_blank");
    // // Asegurarte de que la pestaña de cierre de sesión se abrió correctamente
    // if (signOutTab) {
    //   // Si se abrió correctamente, cerrar la url que se abre (la de cerrar sesión de google)
    //   window.close();
    // }
    //console.log("response axios in model: ", response.data);
  } catch (error) {
    // Manejo de errores en caso de fallo al cerrar sesión
    console.log("Error en model");
    return false;
  }
}

async function deleteUserById(id) {
  try {
    const response = await fetch(`${RUTA_SERVIDOR}/users/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error deleting user.");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
}

const getAllUsers = async () => {
  try {
    const response = await fetch(`${RUTA_SERVIDOR}/users/`);

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const getUser = async (id) => {
  try {
    const response = await fetch(`${RUTA_SERVIDOR}/users/user/${id}`);
    if (!response.ok) {
      throw new Error("Unable to find user.");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const { email, name, surname, birthdate, city } = userData;
    const response = await fetch(`${RUTA_SERVIDOR}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: id, email, name, surname, birthdate, city }),
    });

    if (!response.ok) {
      throw new Error("Error updating user");
    }
    return response.ok;
  } catch (error) {
    throw error;
  }
};

export {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUserById,
  signIn,
  signOut,
  sendEmail,
  signOutGoogle,
};
