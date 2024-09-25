<script setup>
import { RouterLink, RouterView } from 'vue-router'

import navBar from './components/narvBar.vue';
import navBarAdmin from './components/navBarAdmin.vue';

</script>

<template>
  <v-app>

    <div v-if="isLoading" className="loading">
    </div>

    <div v-else-if="!isLoading">
      <navBar v-if="!user.isAdmin && showNavBar"></navBar>
      <navBarAdmin v-else-if="user.isAdmin && showNavBar"></navBarAdmin>

      <div class="body">
        <RouterView />
      </div>
    </div>


  </v-app>
</template>

<style>
body {
  margin: 0;
}

.loading {
  width: 100%;
  height: 100%;

  background-color: #e5e5f7;
  opacity: 0.8;
  background-image: radial-gradient(#7768e3 1.25px, #e5e5f7 1.25px);
  background-size: 25px 25px;


}
</style>

<script>
import router from './router/index.js';
import { useUserStore } from "./stores/userStore";
import { computed } from 'vue';
//Auth para estado del usuario
import { authFirebase } from './config/firebase/firebaseConfig.js';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      user: {
        isAdmin: false,
      },
      showNavBar: true,
      isLoading: true,
    }
  },
  methods: {

    async showLoading() {

      this.isLoading = true;


      await Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          // Aquí va tu código para cargar los datos
          setTimeout(() => {
            Swal.close();
          }, 1100);
        }
      });
      this.isLoading = false;


    }
  },
  mounted() {
    try {
      router.beforeEach((to, from, next) => {
        this.isLoading = false;
        const store = useUserStore();
        //const storeUser = store.getUser;

        const userNew = computed(() => {
          return store.getUser;
        });

        if (userNew.value != null && userNew.value != undefined) {
          this.user = userNew;
        }
        // Ejecuta el código que deseas antes de que se redirija a cualquier ruta
        //const currentUser = authFirebase.currentUser;

        if (to.path == '/auth') {
          // Redirige a la ruta de autenticación solo si no es la misma ruta actual
          this.showNavBar = false;
        } else {
          this.showLoading();
          //Verificar si está logueado, sino,  no se le deja pasar
          authFirebase.onAuthStateChanged((user) => {

            if (!user) {
              // El usuario está autenticado, puedes acceder a su información
              // Aquí puedes realizar acciones para usuarios autenticados, como redireccionar a una página de inicio de sesión exitosa, cargar datos específicos del usuario, etc.
              console.log('Acceso no autorizado, usuario no autenticado');

              this.showNavBar = false;
            }

            this.showNavBar = true;
          });
        }

        next();
      });

    } catch (error) {
      console.log(error);
    }
  },
  updated() {
    const store = useUserStore();
    //const storeUser = store.getUser;

    const userNew = computed(() => {
      return store.getUser;
    });

    if (userNew.value != null && userNew.value != undefined) {
      this.user = userNew;
    }
  }
};

</script>
