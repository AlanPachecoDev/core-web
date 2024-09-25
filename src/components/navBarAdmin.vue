
<script>
import { computed } from 'vue';

import { useUserStore } from "../stores/userStore";

import { logOut } from "../controllers/usersController";
export default {
    data() {

        return {
        }
    },
    methods: {
        goHome() {
            this.$router.push('/homeAdmin');
        },
        async signOut() {
            try {
                await logOut();
            }
            catch (error) {
                console.log(error);
            }
        }
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
        const store = useUserStore();
        const user = computed(() => {
            return store.getUser;
        });
        console.log("User at navBar: ", user);
        return { user };
    },
}
</script>

<template>
    <v-app-bar density="compact" class="navBar">
        <i @click="goHome()" class="mdi mdi-home mdi-36px iconBtn"></i>
        <v-app-bar-title id="barTitle">Guru Project - Admin</v-app-bar-title>
        <h2>Bienvenid@ {{ user.name }} {{ user.surname }} </h2>

        <i @click="signOut()" class="mdi mdi-logout mdi-36px iconBtn"></i>
    </v-app-bar>
</template>
