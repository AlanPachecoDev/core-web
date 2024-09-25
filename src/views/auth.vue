
<template>
    <div class="visibleArea">
        <div class="container" :class="{ 'isRegister': !logIn }">
            <register v-if="!logIn"></register>
            <loginWithOAUTH v-if="logIn"></loginWithOAUTH>
            <GoogleLogInButton></GoogleLogInButton>
            <el-button class="btn" @click="switchButton()">{{ textoBtn }}</el-button>
        </div>
    </div>
</template>
<script>
import loginWithOAUTH from "../components/loginWithOAUTH.vue";
import register from "../components/register.vue";
import GoogleLogInButton from "../components/GoogleLogInButton.vue";
//import login from "../components/login.vue"
export default {
    components: {
        // Registrar el componente importado
        register,
        loginWithOAUTH,
        GoogleLogInButton
    },
    data() {
        return {
            logIn: true,
            textoBtn: "Registrarse"
        }
    },
    methods: {
        switchButton() {
            this.logIn = !this.logIn;
            if (this.logIn) {
                this.textoBtn = "Registrarse";
            } else {
                this.textoBtn = "Iniciar sesión";
            }
        }
    }
}
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    min-height: 50% !important;
    height: 50% !important;
    margin: 1% 0% 10% 0%;
}

.isRegister {
    display: flex;
    flex-direction: column;
    min-height: 75% !important;
    height: 75% !important;
    margin: 1% 0% 10% 0%;
}

.btn {
    margin: 3% 0%;
}
</style>