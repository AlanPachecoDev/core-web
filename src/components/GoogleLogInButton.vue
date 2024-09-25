<template>
  <div class="button-container">
    <div
      class="g-signin2"
      id="buttonDiv"
      data-onsuccess="onSignIn"
      data-itp_support="false"
    ></div>
  </div>
</template>

<script>
import { logInGoogle, logIn, create } from "../controllers/usersController";

// Importa Axios
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {
  data() {
    return {
      user: {
        name: "",
        surname: "",
        password: null,
        email: null,
        city: "",
        birthdate: "",
        isAdmin: false,
      },
    };
  },
  methods: {
    async signInG() {
      //Forma rediriendo por url
      // const params = new URLSearchParams();
      // params.append(
      //   "client_id",
      //   ""
      // );
      // params.append("redirect_uri", "http://localhost:5173/auth");
      // params.append("response_type", "code");
      // params.append("scope", "openid email profile");
      // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },
    async logGoogle(authorizationCode) {
      try {
        console.log("authorizationCode:", authorizationCode);
        authorizationCode = authorizationCode.credential;
        const user = VueJwtDecode.decode(authorizationCode);
        console.log("Datos del usuario:", user);

        //console.log("user: ", user);
        this.user = {
          uid: user.sub,
          name: user.given_name,
          surname: user.family_name,
            password: user.sub,
          email: user.email,
          city: user.sub,
          fullName: user.name,
          birthdate: user.name,
          isAdmin: false,
          authorizationCode: authorizationCode.credential,
        };
        const response = await logInGoogle({
          uid: user.sub,
          name: user.given_name,
          surname: user.family_name,
          email: user.email,
          city: user.sub,
          fullName: user.name,
          birthdate: user.name,
          isAdmin: false,
          authorizationCode: authorizationCode.credential,
        });
        this.user.email = user.email;
        this.user.password = user.sub;
        console.log("response: ", response);

        //El usuario se ha registrado/logueado
        //Iniciamos y guardamos sesión
        const responseLogin = await logIn({
          email: this.user.email,
          password: this.user.password,
        });

        if (!responseLogin) {
          //Si no se pudo loguear es porque toca registrarlo
          const res = await create(this.user);

          //Valida si el usuario se creó correctamente
          if (!res) {
            await this.$swal({
              title: "¡User when trying to create user!",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK",
            });

            return;
          }
          //Iniciamos y guardamos sesión
          const response = await logIn({
            email: this.user.email,
            password: this.user.password,
          });

          if (!response) {
            await this.$swal({
              title: "¡Error when trying to log in!",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK",
            });
          }

          //Si el responde.admin es true quiere decir que es administrador entonces se le redirecciona al dashboard
          if (response.admin == "true") {
            this.$router.push("/homeAdmin");
          } else {
            this.$router.push("/");
          }

          //   await this.$swal({
          //     title: "¡Error when trying to log in!",
          //     icon: "error",
          //     showCancelButton: false,
          //     confirmButtonText: "OK",
          //   });
        } else {
          console.log("response.isAdmin: ", responseLogin.isAdmin);
          //Si el responde.admin es true quiere decir que es administrador entonces se le redirecciona al dashboard
          if (responseLogin.isAdmin === true) {
            this.$router.push("/homeAdmin");
          } else {
            this.$router.push("/");
          }
        }

        this.$router.push("/");

        //console.log("Inicio de sesión exitoso", user);
      } catch (error) {
        console.log("error: ", error);
        await this.$swal({
          title: "¡Error when trying to log in!",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
        //console.error("Inicio de sesión fallido", error);
      }
    },
  },
  async created() {
    var self = this;
    window.onload = function () {
      google.accounts.id.initialize({
        client_id:import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
        callback: function (resposne) {
          self.logGoogle(resposne);
        },
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" } // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
    };
  },
};
</script>

<style>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2%;
}
</style>
