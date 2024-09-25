<template>
    <div class="visibleArea" id="areaEditTask">
        <v-card class="cardList">
            <div class="cardHeader">
                <h2>Actual data</h2>
            </div>

            <div v-if="loading">Loading...</div>
            <v-table v-if="!loading" class="tableList">
                <thead>

                    <tr>
                        <td>
                        <th class="text-left">Author</th>
                        </td>
                        <td>
                        <th class="text-left">Name</th>
                        </td>
                        <td>
                        <th class="text-left">Description</th>
                        </td>
                        <td>
                        <th class="text-left">Start Date</th>
                        </td>
                        <td>
                        <th class="text-left">Estimated End Date</th>
                        </td>
                        <td>
                        <th class="text-left">State</th>
                        </td>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ lastTask.author }}</td>
                        <td>{{ lastTask.name }}</td>
                        <td>{{ lastTask.description }}</td>
                        <td>{{ lastTask.startDate }}</td>
                        <td>{{ lastTask.estimatedEndDate }}</td>
                        <td>{{ lastTask.state }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>


        <div class="containerAddTask">
            <v-card class="mx-auto cardAddProject">
                <div class="cardHeader">
                    <v-card-title>New Task</v-card-title>
                </div>

                <div class="content">

                    <div class="otherInputs" :class="{ 'disabled': isDisabled }">
                        <el-col class="cols" :span="30">
                            <div class="inputContainer">
                                <v-card-subtitle>Task Name</v-card-subtitle>
                                <el-input v-model="task.name" placeholder="Task Name" />
                            </div>

                            <div class="inputContainer">
                                <v-card-subtitle>Members Of Task</v-card-subtitle>
                                <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                                <el-select class="inputSelect" v-model="task.members" multiple
                                    @change="setListOfTaskMembers()">
                                    <el-option v-for="user in users" :key="user.uid" :label="`${user.name} ${user.surname}`"
                                        :value="user.uid" />
                                </el-select>
                            </div>
                            <div class="inputContainer">
                                <v-card-subtitle>Satate</v-card-subtitle>
                                <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                                <el-select class="inputSelect" v-model="task.state">
                                    <el-option label="On hold" value="On hold" />
                                    <el-option label="In Progress" value="In progress" />
                                    <el-option label="QA" value="QA" />
                                    <el-option label="Closed" value="Closed" />
                                </el-select>
                            </div>
                        </el-col>

                        <el-col class="cols" :span="30">
                            <div class="inputContainer">
                                <v-card-subtitle>Task Description</v-card-subtitle>
                                <el-input v-model="task.description" placeholder="Task description" />
                            </div>

                            <div class="inputContainer">
                                <v-card-subtitle>Estimated End Date</v-card-subtitle>
                                <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
                                <el-date-picker v-model="task.estimatedEndDate" class="datePicker" format="DD/MM/YYYY"
                                    value-format="DD/MM/YYYY" type="date"
                                    placeholder="Stimated conclusion date"></el-date-picker>
                            </div>
                        </el-col>

                    </div>
                    <div class="containerButton disabledBtn btnNext" :class="{ 'disabled': isDisabled }">
                        <el-button @click="setDisabled()" class="btnNewTask" type="primary">Next</el-button>

                    </div>


                    <div class="objectivesContainer" :class="{ 'disabled': !isDisabled }">
                        <div class="cardHeader">
                            <v-card-title>Objectives</v-card-title>
                        </div>
                        <div class="objectives">
                            <el-col class="cols" :span="30">
                                <div class="inputContainer">
                                    <v-card-subtitle>Objective</v-card-subtitle>
                                    <el-input v-model="objective.description" placeholder="Objective description" />
                                </div>

                            </el-col>

                            <el-col class="cols" :span="30">
                                <div class="inputContainer">
                                    <v-card-subtitle>Assigned to</v-card-subtitle>
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
                                Objective</el-button>

                        </div>

                    </div>
                </div>
            </v-card>
        </div>


        <div class="containerNewTask objectiveCard" :class="{ 'disabled': !isDisabled }">


            <v-card className="vCardNewTask">
                <v-table class="tableObjectives">
                    <thead id="carHeaderTHead">
                        <tr>
                            <td class="tableColumn">
                            <th class="text-left">Objective</th>
                            </td>
                            <td class="tableColumn">
                            <th class="text-left">Assigned to</th>
                            </td>
                            <td class="tableColumn">
                            <th class="text-left"></th>
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
                <el-button @click="update()" class="btnNewTask" type="primary"> +
                    Edit Task</el-button>

            </div>

        </div>




    </div>
</template>


<script>

import { getProjectById } from '../../../controllers/projectsController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { getTaskById } from '../../../controllers/tasksController.js';
import { updateTaskById } from '../../../controllers/tasksController.js';
//Alertas
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useUserStore } from "../../../stores/userStore";


export default {
    data() {
        return {
            allUsers: [],
            project: {},
            projectSelected: "",
            projects: [],
            users: [],
            lastTask: {
                name: "",
                objectives: [],
                description: "",
                estimatedEndDate: "",
            },
            task: {
                name: "",
                objectives: [],
                description: "",
                estimatedEndDate: "",
                state: ""
            },
            membersOfTask: [],
            objective: {
                description: "",
                members: [],
                state: "0%"
            },
            isDisabledSelectProject: false,
            isDisabled: false,
            showTable: false,
        }

    }, component: {
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
        async update() {
            console.log("this.task: ", this.task);

            //Recupera usuario que está actualmente activo
            // const store = useUserStore();
            // const user = store.getUser;
            // this.task.author = user.id;
            // this.task.projectId = this.project.id;
            const res = await updateTaskById(this.task.id, this.task);


            if (res != false) {
                await this.$swal({
                    title: "¡Task modified successfully!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });

                this.$router.push('/admin/task/');

            } else {
                await this.$swal({
                    title: "An error ocurred at edit task.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                const id = this.$route.params.id;
                this.$router.push({ name: "editTask", params: { id } });

            }
            return;

        }
    },
    async mounted() {
        
        //Recuperamos la tarea
        this.task = await getTaskById(this.$route.params.id);
        console.log("this.task: ", this.task);
        this.lastTask = Object.assign({}, this.task);

        //Recuperamos todos los usuarios con sus atributos
        this.allUsers = await getUsers();

        //Cambiamos el author para que muestre el nombre y el apellido del creador
        this.allUsers.filter((user) => {
            console.log("user.uid: ", user.uid, " this.lastTask.author: ", this.lastTask.author);
            if (user.uid == this.lastTask.author) {
                this.lastTask.author = user.name + " " + user.surname;
            }
        });

        this.users = this.allUsers;

        //this.objective.members = this.task.members;
        this.membersOfTask = this.task.members;
        //Aquí se filtran solo los usuarios que pertenecen al proyecto y se recuperan sus datos
        this.membersOfTask = this.allUsers.filter((user) => this.task.members.includes(user.uid));
    },
};
</script>


<style>
.cardList {
    overflow: unset !important;
}

.errorMessage {
    color: #dcdfe6;
}

.formContainer {
    display: flex;
    flex-direction: column !important;
    align-items: center;

    background-color: rgba(85, 85, 85, 0.865);
}

.rowEdit {


    width: 100%;
    height: fit-content;
    margin-bottom: 20px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    /* height: fit-content; */
    /* margin-bottom: 10px; */
}

.colInputs {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 50%;

    /* background-color: green; */
}

.input {
    margin: 0px !important;
    padding: 1px 11px !important;
    width: 75% !important;
    height: 38px;
    min-width: 150px;

    border-radius: 4px;
    box-shadow: 0 0 0 1px #dcdfe6;
    border: none;
    /* display: flex !important;
    justify-content: center;
    background-color: yellow; */
}

.container {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
}

.form {
    width: 80%;
    text-align: center;
}
</style>