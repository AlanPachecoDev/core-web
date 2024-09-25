
<template>
    <div class="visibleArea">
        <v-card class="cardAddProject" id="cardSelectProject">
            <div class="cardHeader">
                <v-card-title>Selecciona el proyecto que quieres borrar</v-card-title>
            </div>
            <div class="inputContainer">
                <v-card-subtitle>Project</v-card-subtitle>
                <el-select class="inputSelect" v-model="projectSelected" @change="selectProject()">
                    <el-option v-for="project in projects" :key="project.id"
                        :label="`${project.name}  BY  ${project.author}`" :value="project.id" />
                </el-select>
            </div>

            <div class="projectDeleteDetails" v-if="isProjectSelected">
                <div class="cardHeader">
                    <v-card-title>Detalles del proyecto</v-card-title>
                </div>
                <div class="projectDetailsContainer">
                    <div class="projectDetails">
                        <h3>Nombre</h3>
                        <p>{{ project.name }}</p>
                        <h3>Descripción</h3>
                        <p>{{ project.description }}</p>
                        <h3>Nombre del equipo</h3>
                        <p>{{ project.teamName }}</p>
                    </div>
                    <div class="projectDetails">
                        <h3>Autor</h3>
                        <p>{{ project.author }}</p>
                        <h3>Miembros</h3>
                        <div class="showMembers">
                            <p v-for="member in project.teamMembers" :key="member">{{ member }}</p>
                        </div>

                    </div>
                </div>
                <div class="cardHeader">
                    <div class="containerBtn">
                        <i @click="deleteProject()" class="mdi mdi-briefcase-remove mdi-36px iconBtn"></i>
                    </div>
                </div>
            </div>


        </v-card>

    </div>
</template>

<script>

import { deleteProject } from '../../../controllers/projectsController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { createATask } from '../../../controllers/tasksController.js';
import { getProjectsByUser } from '../../../controllers/projectsController';
//Alertas
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useUserStore } from "../../../stores/userStore";

export default {
    data() {
        return {
            isProjectSelected: false,
            allUsers: [],
            project: {},
            projectSelected: "",
            projects: [],
            users: [],
        }
    },
    component: {
        VueSweetalert2,
    },
    methods: {
        async selectProject() {
            //Recuperamos el proyecto de la lista 
            this.project = this.projects.filter((project) => {
                if (project.id == this.projectSelected) {
                    return project;
                }
            });
            this.project = this.project[0];
            //this.project = await getProjectById(this.projectSelected);
            //this.project.teamMembers contiene a los miembros de este proyecto
            console.log("this.allUsers: ", this.allUsers);
            if (this.allUsers != "Error") {
                //Aquí se filtran solo los usuarios que pertenecen al proyecto y se recuperan sus datos
                this.users = this.allUsers.filter((user) => this.project.teamMembers.includes(user.uid));
            }

            this.project.teamMembers = this.getNames(this.project.teamMembers);
            console.log("Project selected: ", this.project);
            this.project.teamMembers.push(this.project.author);
            this.isDisabledSelectProject = true;
            this.isProjectSelected = true;

        },
        addNewObjective() {
            if (this.objective.description != "" && this.objective.members.length > 0) {

                this.task.objectives.push(this.objective);
                //Borramos el objetivo
                this.objective = {
                    description: "",
                    members: [],
                    state: "0%"
                };
                this.showTable = true;
            }

        },
        getNames(ids) {
            const usersNames = this.allUsers.filter((user) => ids.includes(user.uid));
            const names = usersNames.map(user => user.name + ' ' + user.surname);
            return names;
        },
        deteleObjective(description) {
            let index = this.task.objectives.findIndex(objective => objective.description === description);

            if (index !== -1) {
                this.task.objectives.splice(index, 1);
            }
            console.log("DELETE: this.task.objectives: ", this.task.objectives);
        },
        async setDisabled() {
            //Comprobar que los campos no estén vacíos
            if (this.task.name.length < 1 || this.task.members.length < 1 || this.task.description.length < 1) {
                await this.$swal({
                    title: "Please verify that all the information is properly filled.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                return;
            }

            this.isDisabled = true;
        },
        async deleteProject() {
            const result = await this.$swal({
                title: '¿Estás seguro de eliminar el proyecto?',
                text: 'Se borrarán todas sus tareas asociadas.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: "No",
            });
            if (result.isConfirmed) {
                const res = await deleteProject(this.project.id);
                if (res) {
                    await this.$swal({
                        title: "¡El proyecto se eliminó correctamente!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });

                } else {
                    await this.$swal({
                        title: "¡El proyecto NO se eliminó correctamente!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
                
            }else{
                await this.$swal({
                        title: "¡El proyecto NO se eliminó!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
            }
            this.$router.push('/');

        }
    },
    async mounted() {
        //Recupera usuario que está actualmente activo
        const store = useUserStore();
        const user = store.getUser;
        const authorId = user.id;

        //Recuperamos la lista de proyectos
        this.projects = await getProjectsByUser(authorId);

        //Cambiamos el author para que muestre el nombre y el apellido del creador
        for (let i = 0; i < this.projects.length; i++) {
            this.projects[i].author = user.name + " " + user.surname;
        }

        //Recuperamos todos los usuarios
        this.allUsers = await getUsers();

    },
}
</script>

<style>
.projectDeleteDetails {
    width: 100%;
    background-color: rgba(222, 217, 217, 0.5);

}

.projectDetailsContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 2% 0px;
}

.projectDetails {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    height: fit-content;
    color: black !important;
    padding: 30px 50px;
}

.showMembers {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    height: 100%;
    max-height: 70px;
    overflow-y: auto;
    height: fit-content;
    color: black !important;
    background-color: rgb(183, 184, 186);
    padding: 0px 10px;
    border-radius: 10px;
}

/* Nuevo */
#carHeaderTHead {
    width: 100% !important;
    height: 60px !important;

    background-color: rgb(40, 40, 40);
    color: white;
}

#cardSelectProject {
    height: fit-content !important;
}

.btnNext {
    margin-top: 20px;
}

.content {
    display: flex;
    flex-direction: column;
}

.containerAddTask {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    /* display: grid; */
}

.objectiveCard {
    padding-bottom: 20px;
    height: fit-content !important;
}

.vCardNewTask {
    margin-top: 100px;
    width: 80% !important;
    height: fit-content !important;

    display: flex !important;
    /* flex-direction: row !important; */

}

.tableObjectives {
    background-color: rgba(85, 85, 85, 0.865) !important;
    color: rgb(255, 255, 255) !important;
    width: 100%;
    height: 100%;
}


.tableColumn {
    width: 50%;
}

.tableRow {
    color: rgb(255, 255, 255);
}

.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.otherInputs {
    width: 100%;
    height: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

}

.cols {
    width: 100%;
    height: 80%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.objectivesContainer {
    height: 50%;
}

.objectives {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;

    align-items: center;
}

.containerButton {
    display: flex;
    justify-content: end;
    padding-right: 10px;
    margin: 20px;
}

.disabledBtn {
    margin: 0px;
    padding-right: 30px;
    margin-top: 20px;
}

.inputContainer {
    background-color: rgb(209, 208, 208) !important;
    margin: 2% 5% !important;
    width: 90% !important;
    height: 50px !important;
}



.datePicker {
    width: 100% !important;
}

.inputSelect {
    width: 100% !important;
}


.containerNewTask {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>