<template>
    <div class="containerRegister">
        <v-card class="mx-auto cardRegister" max-width="500">
            <div class="cardHeader">
                <v-card-title>New User</v-card-title>
            </div>
            <div class="formContainer">
                <div class="inputContainer">
                    <v-card-subtitle>Name</v-card-subtitle>
                    <el-input v-model="user.name" @input="validate('name')" placeholder="Your name" required />
                </div>
                <p class="errorMessage" v-if="!validations.name.state">{{ validations.name.error }}</p>

                <div class="inputContainer">
                    <v-card-subtitle>Surname</v-card-subtitle>
                    <el-input v-model="user.surname" @input="validate('surname')" placeholder="Your surname" required />
                </div>
                <p class="errorMessage" v-if="!validations.surname.state">{{ validations.surname.error }}</p>

                <div class="inputContainer">
                    <v-card-subtitle>Email</v-card-subtitle>
                    <el-input v-model="user.email" @input="validate('email')" placeholder="Your email" required />
                </div>
                <p class="errorMessage" v-if="!validations.email.state">{{ validations.email.error }}</p>

                <div class="inputContainer ">
                    <v-card-subtitle>Password</v-card-subtitle>
                    <div class="passwordField">
                        <el-input @input="validate('password')" class="passInput" v-model="user.password"
                            :type="showPassword ? 'text' : 'password'" placeholder="Your password"></el-input>
                        <el-button class="passBtn" @click="togglePasswordVisibility">
                            <v-icon v-if="!showPassword">mdi-eye-outline </v-icon>
                            <v-icon v-if="showPassword">mdi-eye-off-outline </v-icon>
                        </el-button>
                    </div>
                </div>
                <p class="errorMessage" v-if="!validations.password.state">{{ validations.password.error }}</p>

                <div class="inputContainer ">
                    <v-card-subtitle>Confirm your password</v-card-subtitle>
                    <div class="passwordField">
                        <el-input @input="validate('confirmPassword')" class="passInput" v-model="verifyPassword.password"
                            :type="showPassword2 ? 'text' : 'password'" placeholder="Confirm your password"></el-input>
                        <el-button class="passBtn" @click="togglePasswordVisibilityVerify">
                            <v-icon v-if="!showPassword2">mdi-eye-outline </v-icon>
                            <v-icon v-if="showPassword2">mdi-eye-off-outline </v-icon>
                        </el-button>
                    </div>
                </div>
                <p class="errorMessage" v-if="!verifyPassword.state">{{ verifyPassword.error }}</p>

                <div class="inputContainer">
                    <v-card-subtitle>City</v-card-subtitle>
                    <el-input v-model="user.city" @input="validate('city')" placeholder="Your city" required />
                </div>
                <p class="errorMessage" v-if="!validations.city.state">{{ validations.city.error }}</p>

                <div class="inputContainer">
                    <v-card-subtitle>Birthdate</v-card-subtitle>
                    <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
                    <el-date-picker v-model="user.birthdate" @input="validate('birthdate')" @change="validate('birthdate')"
                        format="DD/MM/YYYY" value-format="DD/MM/YYYY" type="date"
                        placeholder="Pick your birthdate"></el-date-picker>
                </div>
                <p class="errorMessage" v-if="!validations.birthdate.state">{{ validations.birthdate.error }}</p>

                <div class="inputContainer">
                    <v-card-subtitle>Administrador</v-card-subtitle>
                    <el-switch v-model="user.isAdmin" active-value="true" inactive-value="false"></el-switch>
                </div>
                <div class="cardHeader">
                    <div class="containerBtn">
                        <i @click="createUser()" class="mdi mdi-plus-box mdi-36px iconBtn"></i>
                    </div>
                    <!-- <el-button type="primary" :icon="Delete" @click="createUser()">Crear Usuario</el-button> -->
                </div>
            </div>
        </v-card>
    </div>
</template>


    
<script>
import { ElDatePicker } from 'element-plus';
//Alertas
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//Validaciones
import { validateEmail, validateName, validateSurname, validateCity, validatePassword, validateBirthdate } from "../../../validations/rules.js";

import { create } from "../../../controllers/usersController";

export default {
    data() {
        return {
            user: {
                name: "",
                surname: "",
                password: "",
                email: '',
                city: '',
                birthdate: '',
                isAdmin: false,
            },
            verifyPassword: {
                password: "",
                error: "",
                state: false,
            },
            validations: {
                name: { state: false, error: "" },
                surname: { state: false, error: "" },
                password: { state: false, error: "" },
                email: { state: false, error: "" },
                city: { state: false, error: "" },
                birthdate: { state: false, error: "" },
            },
            showPassword: false,
            showPassword2: false,
        }

    }, components: {
        VueSweetalert2,
        ElDatePicker,
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword; // Invertir el valor de showPassword al hacer clic en el botón
        },
        togglePasswordVisibilityVerify() {
            this.showPassword2 = !this.showPassword2;
        },
        async createUser() {
            this.user.isAdmin = this.user.isAdmin === 'true' ? true : false;

            //Validaciones
            this.isFormatValid = Object.values(this.validations).every(function (elemento) {
                return elemento.state === true;
            });

            //Comprobar que las contraseñas sean iguales
            if (!this.verifyPassword.state) {
                await this.$swal({
                    title: "Password and confirm password needs to be equals.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                return;
            }

            if (!this.isFormatValid) {
                await this.$swal({
                    title: "Please follow the input rules.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });

                return;
            }

            const result = await this.$swal({
                title: '¿Do you want to create a new user?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: "No",
            });
            if (result.isConfirmed) {

                const res = await create(this.user);

                //Valida si el usuario se creó correctamente
                if (!res) {
                    await this.$swal({
                        title: "¡Error when trying to create user!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });

                    return;
                }

                await this.$swal({
                    title: "¡User created successfully!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });

                this.$router.push('/admin/users');
            }

        },

        validate(type) {

            if (type == "name") {
                let res = validateName(this.user.name);
                if (res === true) {
                    this.validations.name.state = true;
                    return;
                }
                this.validations.name.state = false;
                this.validations.name.error = res;

            }

            if (type == "surname") {
                let res = validateSurname(this.user.surname);
                if (res === true) {
                    this.validations.surname.state = true;
                    return;
                }
                this.validations.surname.state = false;
                this.validations.surname.error = res;

            }

            if (type == "email") {
                let res = validateEmail(this.user.email);
                if (res === true) {
                    this.validations.email.state = true;
                    return;
                }
                this.validations.email.state = false;
                this.validations.email.error = res;

            }

            if (type == "password") {
                let res = validatePassword(this.user.password);
                if (res === true) {
                    this.validations.password.state = true;
                    return;
                }
                this.validations.password.state = false;
                this.validations.password.error = res;

            }

            if (type == "confirmPassword") {

                if (this.verifyPassword.password !== this.user.password) {
                    //set error
                    console.log("No iguales");
                    this.verifyPassword.error = "The password and confirm password are not equals.";
                    this.verifyPassword.state = false;
                    return;
                }

                this.verifyPassword.error = "";
                this.verifyPassword.state = true;


            }


            if (type == "city") {
                let res = validateCity(this.user.city);
                if (res === true) {
                    this.validations.city.state = true;
                    return;
                }
                this.validations.city.state = false;
                this.validations.city.error = res;

            }

            if (type == "birthdate") {
                let res = validateBirthdate(this.user.birthdate);
                if (res === true) {
                    this.validations.birthdate.state = true;
                    return;
                }
                this.validations.birthdate.state = false;
                this.validations.birthdate.error = res;

            }

        },
    },

};
</script>

<style>
.container {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    width: 80%;
    text-align: center;
}

.formContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(85, 85, 85, 0.865);
}

.passwordField {
    display: flex;
    flex-direction: row;
    width: 100%;
}

/* .passInput{
    width: 80%;
}
.passBtn{
    width: 20%;
} */

.inputContainer {
    background-color: rgb(208, 209, 209);
    margin: 2% 5%;
    height: 50px;
}


.containerRegister {
    width: 100%;
    height: 100%;
    display: grid;
}

.cardRegister {
    margin: auto;
    width: 50%;
    display: flex !important;
    flex-direction: column !important;
    justify-items: center !important;

    background-color: rgb(219, 224, 224) !important;

    text-align: center;
}
</style>