<template>
    <div class="containerNewTask">
        <div className="vCardNewTask cardList">
            <div class="imagenLeftTaskContainer">
                <img src="../../../assets/images/AddTask.jpg" class="imagenLeftTask" />
            </div>

            <div class="rightTaskContainer">
                <v-card-title>
                    Información Básica
                </v-card-title>
                <div class="otherInputs" :class="{ 'disabled': isDisabled }">
                    <el-col class="cols" :span="30">
                        <div class="inputContainer">
                            <v-card-subtitle class="subtitle">Nombre De La Tarea</v-card-subtitle>
                            <el-input v-model="task.name" placeholder="Nombre De La Tarea" />
                        </div>

                        <div class="inputContainer">
                            <v-card-subtitle class="subtitle">Miembros</v-card-subtitle>
                            <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                            <el-select class="inputSelect" v-model="task.members" multiple @change="setListOfTaskMembers()">
                                <el-option v-for="user in users" :key="user.uid" :label="`${user.name} ${user.surname}`"
                                    :value="user.uid" />
                            </el-select>
                        </div>
                    </el-col>

                    <el-col class="cols" :span="30">
                        <div class="inputContainer">
                            <v-card-subtitle class="subtitle">Descripción</v-card-subtitle>
                            <el-input v-model="task.description" placeholder="Descripción" />
                        </div>

                        <div class="inputContainer">
                            <v-card-subtitle class="subtitle">Fecha De Conclusión Estimada</v-card-subtitle>
                            <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
                            <el-date-picker v-model="task.estimatedEndDate" class="datePicker" format="DD/MM/YYYY"
                                value-format="DD/MM/YYYY" type="date"
                                placeholder="Fecha De Conclusión Estimada"></el-date-picker>
                        </div>
                    </el-col>
                </div>
                <div class="containerButton disabledBtn" :class="{ 'disabled': isDisabled }">
                    <el-button @click="setDisabled()" class="btnNewTask" type="primary">Siguiente</el-button>

                </div>


                <div class="objectivesContainer" :class="{ 'disabled': !isDisabled }">
                    <v-card-title>
                        Objectives
                    </v-card-title>
                    <div class="objectives">
                        <el-col class="cols" :span="30">
                            <div class="inputContainer">
                                <v-card-subtitle class="subtitle">Objetivo</v-card-subtitle>
                                <el-input v-model="objective.description" placeholder="Objetivo" />
                            </div>

                        </el-col>

                        <el-col class="cols" :span="30">
                            <div class="inputContainer">
                                <v-card-subtitle class="subtitle">Asignar a</v-card-subtitle>
                                <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                                <el-select class="inputSelect" v-model="objective.members" multiple>
                                    <el-option v-for="user in membersOfTask" :key="user.uid"
                                        :label="`${user.name} ${user.surname}`" :value="user.uid" />
                                </el-select>
                            </div>

                        </el-col>

                    </div>
                    <div class="containerButton">
                        <el-button @click="addNewObjective()" class="btnNewTask" type="primary"> +
                            Objetivo</el-button>

                    </div>

                </div>

            </div>
        </div>
    </div>

    <div class="containerNewTask objectiveCard" v-if="showTable">


        <v-card className="vCardNewTask">
            <v-table class="tableObjectives">
                <thead>
                    <tr>
                        <td class="tableColumn">
                        <th class="text-left">Objetivo</th>
                        </td>
                        <td class="tableColumn">
                        <th class="text-left">Asignado a</th>
                        </td>

                    </tr>
                </thead>
                <tbody>
                    <tr class="tableRow" v-for="(objective, index) in task.objectives" :key="index">
                        <td class="tableColumn">{{ objective.description }}</td>
                        <td class="tableColumn">{{ getNames(objective.members) }}</td>
                        <td class="tableColumn"><v-btn density="compact" icon="mdi-delete-forever"
                                @click="deteleObjective(objective.description)" color="secondary"
                                class="deleteButton"></v-btn></td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
        <div class="containerButton">
            <el-button @click="create()" class="btnNewTask" type="primary"> +
                Crear Tarea</el-button>

        </div>

    </div>
</template>

<script>

import { getProjectById } from '../../../controllers/projectsController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { createATask } from '../../../controllers/tasksController.js';

//Alertas
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useUserStore } from "../../../stores/userStore";

export default {
    data() {
        return {
            allUsers: [],
            project: {},
            users: [],
            task: {
                name: "",
                objectives: [],
                description: "",
                estimatedEndDate: "",
            },
            membersOfTask: [],
            objective: {
                description: "",
                members: [],
                state: "0%",
                endDate: ""
            },
            isDisabled: false,
            showTable: false,
        }
    },
    component: {
        VueSweetalert2,
    },
    methods: {
        setListOfTaskMembers() {
            this.membersOfTask = this.task.members;
            //Aquí se filtran solo los usuarios que pertenecen al proyecto y se recuperan sus datos
            this.membersOfTask = this.allUsers.filter((user) => this.task.members.includes(user.uid));
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
            return names.join(", ");
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

            console.log("Task by disabled: ", this.task);
            this.isDisabled = true;
        },
        async create() {
            console.log("this.task: ", this.task);

            //Recupera usuario que está actualmente activo
            const store = useUserStore();
            const user = store.getUser;
            this.task.author = user.id;
            this.task.projectId = this.$route.params.id;
            const res = await createATask(this.task);


            if (res != "Error") {
                await this.$swal({
                    title: "¡Task created successfully!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });

                let iddd = this.$route.params.id;
                this.$router.push({ name: "project", params: { iddd } });

            } else {
                await this.$swal({
                    title: "An error ocurred at create task.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                this.$router.push({ name: "newTask", params: { id } });

            }
            return;

        }
    },
    async mounted() {
        //Recuperamos el proyecto
        this.project = await getProjectById(this.$route.params.id);
        //this.project.teamMembers contiene a los miembros de este proyecto

        this.project.teamMembers.push(this.project.author);
        //Recuperamos todos los usuarios con sus atributos
        this.allUsers = await getUsers();

        if (this.allUsers != "Error") {
            //Aquí se filtran solo los usuarios que pertenecen al proyecto y se recuperan sus datos
            this.users = this.allUsers.filter((user) => this.project.teamMembers.includes(user.uid));
        }

    },
}
</script>

<style>
.subtitle {
    background-color: black;
}

.objectiveCard {
    height: fit-content !important;
}

.tableObjectives {
    background-color: #afcef0 !important;
    color: rgb(30, 28, 28) !important;
    width: 100%;
    height: 100%;
}


.tableColumn {
    width: 45%;
}

.tableRow {
    color: rgb(121, 121, 121);
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
    margin-top: -27px;
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

.inputs {
    background-color: rgb(166, 121, 121) !important;
}

.containerNewTask {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.vCardNewTask {
    width: 80%;
    height: fit-content;

    display: flex !important;
    /* flex-direction: row !important; */

}

.rightTaskContainer {

    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.imagenLeftTaskContainer {
    display: flex;
    width: 30%;
    height: fit-content;

}

.imagenLeftTask {
    width: 100%;
    height: 100%;
}
</style>