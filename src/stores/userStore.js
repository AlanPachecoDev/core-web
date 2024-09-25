import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,

    isLogued: localStorage.getItem('isLogued') ? JSON.parse(localStorage.getItem('isLogued')) : null
  }),
  getters: {
    // Agregar getters para acceder a los datos del usuario
    getUser: state => state.user,
    getIsLogued: state => state.isLogued
  },
  actions: {
    setUser(user) {
      console.log("User recibido en store: ", user);
      const { uid, name, surname, email, city, birthdate, isAdmin } = user;
      const id = uid;
      const userAux = { id, name, surname, email, city, birthdate, isAdmin }
      this.user = userAux;

      localStorage.setItem('user', JSON.stringify(userAux)); // Guardar los datos del usuario en el localStorage al actualizar el store

    },
    setUserGoogle(user) {
      console.log("User recibido en store: ", user);
      const { uid, name, surname, email, city, birthdate, isAdmin, authorizationCode } = user;
      const id = uid;
      const userAux = { id, name, surname, email, city, birthdate, isAdmin, authorizationCode }
      this.user = userAux;

      localStorage.setItem('user', JSON.stringify(userAux)); // Guardar los datos del usuario en el localStorage al actualizar el store

    },
    setIsLogued(isLogued) {
      this.isLogued = isLogued;
      localStorage.setItem('isLogued', JSON.stringify(isLogued)); // Guardar los datos del usuario en el localStorage al actualizar el store

    },

  },
})

