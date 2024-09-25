<script>
import { computed } from "vue";

import { useUserStore } from "../stores/userStore";

import { logOutGoogle } from "../controllers/usersController";
export default {
  data() {
    return {
    };
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    handleContacts() {
      this.$router.push("/contacts");
    },
    async signOut() {
      try {
        await logOutGoogle();
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
  },
  setup() {
    const store = useUserStore();
    const user = computed(() => {
      return store.getUser;
    });
    console.log("User at navBar: ", user);
    return { user };
  },
  mounted() {
    // gapi.load("auth2", function () {
    //   gapi.auth2.init({
    //     client_id: "", // Reemplaza esto con tu Client ID.
    //   });
    // });

    const store = useUserStore();
    const user = computed(() => {
      return store.getUser;
    });
    console.log("User at navBar: ", user);
    return { user };
  },
};
</script>

<template>
  <v-app-bar density="compact" class="navBar">
    <i @click="goHome()" class="mdi mdi-home mdi-36px iconBtn"></i>
    <i
      @click="handleContacts()"
      class="mdi mdi-card-account-mail mdi-36px iconBtn"
    ></i>

    <v-app-bar-title id="barTitle">Guru Project</v-app-bar-title>

    <h2>Bienvenid@ {{ user.name }} {{ user.surname }}</h2>

    <i @click="signOut()" class="mdi mdi-logout mdi-36px iconBtn"></i>
  </v-app-bar>
</template>

<style>
.containerContacts{
  
  position: absolute;
  z-index: 3;
  width: 300px;
  height: 500px;

  top: 20px;
}
</style>