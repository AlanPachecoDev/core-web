<template>
    <div class="containerAddProject">
        <v-card class="mx-auto cardAddProject">
            <div class="cardHeader">
                <v-card-title>New Project</v-card-title>
            </div>
            <!-- <div class="formContainer"> -->
            <el-row class="rows">
                <div class="columnsContainer">
                    <el-col class="cols" :span="30">
                        <div class="inputContainer">
                            <v-card-subtitle>Project Name</v-card-subtitle>
                            <el-input v-model="project.name" @input="validate('projectName')" placeholder="Project name"
                                required />
                        </div>
                        <p class="errorMessage" v-if="!validations.name.state">{{ validations.name.error }}</p>

                    </el-col>
                    <el-col class="cols" :span="30">

                        <div class="inputContainer">
                            <v-card-subtitle>Team Name</v-card-subtitle>
                            <el-input v-model="project.teamName" @input="validate('teamName')" placeholder="Team name"
                                required />
                        </div>
                        <p class="errorMessage" v-if="!validations.teamName.state">{{ validations.teamName.error }}</p>
                    </el-col>

                </div>
            </el-row>

            <el-row class="rows">
                <div class="columnsContainer">
                    <el-col class="cols" :span="30">

                        <div class="inputContainer">
                            <v-card-subtitle>Project Description</v-card-subtitle>
                            <el-input v-model="project.description" @input="validate('description')"
                                placeholder="Project description" required />
                        </div>
                        <p class="errorMessage" v-if="!validations.description.state">{{ validations.description.error }}
                        </p>



                    </el-col>
                    <el-col class="cols" :span="30">

                        <div class="inputContainer">
                            <v-card-subtitle>Members Of Project</v-card-subtitle>
                            <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                            <el-select class="inputContainerSelect" v-model="project.teamMembers" multiple>
                                <el-option v-for="user in users" :key="user.uid" :label="`${user.name} ${user.surname}`"
                                    :value="user.uid" />
                            </el-select>
                        </div>

                    </el-col>

                </div>
            </el-row>

            <el-row class="rows">
                <div class="inputContainerDate">
                    <div class="containerDate">
                        <v-card-subtitle>Estimated End Date</v-card-subtitle>
                        <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
                        <el-date-picker class="inputDate" v-model="project.estimatedEndDate"
                            @change="validate('estimatedEndDate')" format="DD/MM/YYYY" value-format="DD/MM/YYYY" type="date"
                            placeholder="Stimated conclusion date"></el-date-picker>
                    </div>
                    <p class="errorMessage" v-if="!validations.estimatedEndDate.state">{{ validations.estimatedEndDate.error
                    }}</p>

                </div>
            </el-row>

            <div class="cardHeader">
                <div class="containerBtn">
                    <i @click="createProject()" class="mdi mdi-plus-box mdi-36px iconBtn"></i>
                </div>
            </div>
            <!-- </div> -->
        </v-card>
    </div>
</template>

<script>

import { validateProjectName, validateTeamName, validateDescription, validateEndDate } from "../../../validations/rules.js";
import { getUsersToCreateProject } from "../../../controllers/usersController.js";

import { createAProject } from "../../../controllers/projectsController.js";

import { useUserStore } from "../../../stores/userStore";

export default {




    data() {
        return {
            user: {},
            project: {
                author: "",
                teamName: "",
                name: "",
                description: "",
                estimatedEndDate: "",
                teamMembers: []
            },
            users: [],
            validations: {
                teamName: {
                    state: false,
                    error: "",
                },
                name: {
                    state: false,
                    error: "",
                },
                description: {
                    state: false,
                    error: "",
                },
                estimatedEndDate: {
                    state: false,
                    error: "",
                },
                teamMembers: {
                    state: false,
                    error: "",
                },
            }
        }
    },
    methods: {
        async createProject() {
            this.project.author = this.user.id;
            
            if(this.project.estimatedEndDate == "" || this.project.author == "" || this.project.teamName == "" || this.project.name == "" || this.project.description == ""){
                await this.$swal({
                    title: "¡Error, todos los campos deben estar llenos!",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                }); 
                return;
            }

            

            let res = await createAProject(this.project);
            if (res != false) {
                await this.$swal({
                    title: '¡El proyecto se creó correctamente!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                this.$router.push('/');
            } else {
                await this.$swal({
                    title: "¡Error al crear proyecto!",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
            }
        },
        validate(type) {

            if (type == "projectName") {
                let res = validateProjectName(this.project.name);
                if (res === true) {
                    this.validations.name.state = true;
                    return;
                }
                this.validations.name.state = false;
                this.validations.name.error = res;

            }

            if (type == "teamName") {
                let res = validateTeamName(this.project.teamName);
                if (res === true) {
                    this.validations.teamName.state = true;
                    return;
                }
                this.validations.teamName.state = false;
                this.validations.teamName.error = res;

            }

            if (type == "description") {
                let res = validateDescription(this.project.description);
                if (res === true) {
                    this.validations.description.state = true;
                    return;
                }
                this.validations.description.state = false;
                this.validations.description.error = res;

            }

            if (type == "estimatedEndDate") {
                let res = validateEndDate(this.project.estimatedEndDate);
                if (res === true) {
                    this.validations.estimatedEndDate.state = true;
                    return;
                }
                this.validations.estimatedEndDate.state = false;
                this.validations.estimatedEndDate.error = res;

            }

        },
    },
    async mounted() {

        const store = useUserStore();
        this.user = store.getUser;

        this.users = await getUsersToCreateProject(this.user.id);

    }
}
</script>

<style>
.el-select__tags {
    max-height: 20px;
    overflow-y: auto;
}

.containerAddProject {
    width: 100%;
    height: 100%;
    /* display: grid; */
}

.cardAddProject {

    width: 90% !important;
    max-width: none !important;


    background-color: rgb(219, 224, 224) !important;

    text-align: center;
}

.columnsContainer {
    width: 100%;

    display: grid !important;
    grid-template-columns: 1fr 1fr;
}

.rows {
    margin-bottom: 25px;
    justify-content: center;
}

.rowTitle {
    background-color: #409eff;
    color: white;
    font-weight: bold;
    font-size: xx-large;
}

.cols {
    height: 100%;
}

.btnContainer {
    justify-content: center;
    margin-bottom: 20px;
}

.btnNewProject {
    width: 32%;
}

.form {
    width: 80%;
    text-align: center;
}

.formContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.passwordField {
    display: flex;
    flex-direction: row;
    width: 100%;
}




.inputContainerSelect {
    width: 100% !important;
}
</style>