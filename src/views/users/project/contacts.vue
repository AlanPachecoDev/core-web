<template>
  <div class="visibleArea">
    Contactitos
    <h2>Bienvenid@ {{ user.name }} {{ user.surname }}</h2>
    <div class="container">
      <v-card class="mx-auto" max-width="1000">
        <v-list lines="three">
          <v-list-item
            v-for="contact in contacts"
            :key="contact.idContacto"
            :title="contact.idContacto"
            >{{ contact.nombre }} {{ contact.telefono }}</v-list-item
          >
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
//Alertas
import { useUserStore } from "../../../stores/userStore";
import VueSweetalert2 from "vue-sweetalert2";
import { computed } from "vue";
//Ruta para la api
const RUTA_SERVIDOR = `${import.meta.env.VITE_APP_RUTA_API}`;

export default {
  data() {
    return {
      user: {},
      contacts: [],
    };
  },
  component: {
    VueSweetalert2,
  },
  methods: {},
  async mounted() {
    const store = useUserStore();
    const user2 = computed(() => {
      return store.getUser;
    });
    console.log("User at contacts: ", user2);
    this.user = user2;

    // //hago la petición de los contactos al back
    // const response = await fetch(`${RUTA_SERVIDOR}/contactsRoute/`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: this.user.name + " " + this.user.surname
    //   }),
    // });
    // const contactoss = await response;

    // Asegúrate de tener el nombre correctamente formateado (sin espacios innecesarios, etc.)
    const formattedName = this.user.name + " " + this.user.surname;

    // Agrega el nombre como un parámetro en la URL
    console.log("RUTA_SERVIDOREEEE: ", RUTA_SERVIDOR);
    const url = `${RUTA_SERVIDOR}/contacts/getByName/${formattedName}`;

    // Realiza la solicitud GET con la URL modificada
    const response = await fetch(url);

    const contactos = await response.json(); // Si se espera una respuesta JSON
    this.contacts = JSON.parse(contactos);

    console.log("this.contacts: ", this.contacts);
  },
};
</script>

<style>
.container{
    width: 100%;
    height: fit-content;
    display: flex;
    justify-items: center;
    align-items: center;
}

.mx-auto{
    width: 80%;
}
</style>
<!-- this.$router.push('/'); -->
