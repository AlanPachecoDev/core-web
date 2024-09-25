import {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUserById,
  signIn,
  signOutGoogle,
} from "../models/usersModel.js";

import { useUserStore } from "../stores/userStore.js";

const create = async (userData) => {
  try {
    const res = await createUser(userData);

    return res;
  } catch (error) {
    console.error("Error creating user: ", error);
    return false;
  }
};

const logIn = async (userData) => {
  try {
    const res = await signIn(userData);

    if (res) {
      //Guardar el usuario en el store
      const userStore = useUserStore();
      userStore.setUser(res);
      userStore.setIsLogued(true);
      return res;
    } else {
      console.error("Unable to log in.");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const logInGoogle = async (userData) => {
  try {
    let res = userData;
    if (res) {
      //Guardar el usuario en el store
      const userStore = useUserStore();
      userStore.setUserGoogle(res);
      userStore.setIsLogued(true);
      return res;
    } else {
      console.error("Unable to log in.");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const logOut = async () => {
  try {
    const res = await signOut();

    if (res) {
      //El cierre fue exitoso
      const userStore = useUserStore();

      userStore.setIsLogued(false);

      const emptyUser = {
        uid: "",
        name: "",
        surname: "",
        email: "",
        city: "",
        birthdate: "",
        isAdmin: "",
        authorizationCode: "",
      };
      userStore.setUser(emptyUser);
    } else {
      console.error("Unable to log out.");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const logOutGoogle = async () => {
  try {
    const res = await signOutGoogle();

    if (res == true) {
      //El cierre fue exitoso
      const userStore = useUserStore();
      userStore.setIsLogued(false);

      const emptyUser = {
        uid: "",
        name: "",
        surname: "",
        email: "",
        city: "",
        birthdate: "",
        isAdmin: "",
        authorizationCode: "",
      };
      userStore.setUser(emptyUser);
      console.log("EJEJE");
    } else {
      console.error("Unable to log out.");
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (id) => {
  try {
    const res = await deleteUserById(id);

    return true;
  } catch (error) {
    return false;
  }
};

const getUsers = async () => {
  try {
    const users = await getAllUsers();
    return users;
  } catch (error) {
    return false;
  }
};

const getUsersToCreateProject = async (id) => {
  const users = await getUsers();
  if (users) {
    return users.filter((user) => user.uid !== id);
  }

  return false;
};

const getUserById = async (id) => {
  try {
    const user = await getUser(id);
    return user;
  } catch (error) {
    return false;
  }
};

const update = async (id, data) => {
  try {
    const res = await updateUser(id, data);

    if (!res) {
      throw new Error("¡Unknow Error!");
    }
    return true;
  } catch (error) {
    return false;
  }
};

export {
  getUsers,
  getUserById,
  update,
  create,
  deleteUser,
  logIn,
  logOut,
  getUsersToCreateProject,
  logInGoogle,
  logOutGoogle,
};
