<template>
    <div class="visibleArea">
        <v-card v-if="!isProjectSelected" class="cardAddProject" id="cardSelectProject">
            <div class="cardHeader">
                <v-card-title>Select Project</v-card-title>
            </div>
            <el-col class="cols" :span="30">

                <div class="inputContainer">
                    <v-card-subtitle>Project</v-card-subtitle>
                    <!-- <el-input v-model="project.teamMembers" placeholder="Select development members" required /> -->
                    <el-select class="inputSelect" v-model="projectSelected">
                        <el-option v-for="project in projects" :key="project.id"
                            :label="`${project.name}  BY  ${project.author}`" :value="project.id" />
                    </el-select>
                </div>

                <div class="containerButton disabledBtn btnNext" id="btnNextSelectProject"
                    :class="{ 'disabled': isDisabledSelectProject }">
                    <el-button @click="selectProject()" class="btnNewTask" type="primary">Next</el-button>

                </div>
            </el-col>

        </v-card>

        <div v-else-if="isProjectSelected" class="containerAddTask">
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


        <div class="containerNewTask objectiveCard" v-if="showTable">


            <v-card className="vCardNewTask">
                <v-table class="tableObjectives">
                    <thead  id="carHeaderTHead">
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
                <el-button @click="create()" class="btnNewTask" type="primary"> +
                    Create Task</el-button>

            </div>

        </div>
    </div>
</template>

<script>

import { getProjectById } from '../../../controllers/projectsController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { createATask } from '../../../controllers/tasksController.js';
import { getProjects } from '../../../controllers/projectsController.js';
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
                state: "0%"
            },
            isDisabledSelectProject: false,
            isDisabled: false,
            showTable: false,
        }
    },
    component: {
        VueSweetalert2,
    },
    methods: {
        async selectProject() {
            //Recuperamos el proyecto
            this.project = await getProjectById(this.projectSelected);
            //this.project.teamMembers contiene a los miembros de este proyecto
            if (this.allUsers != "Error") {
                //Aquí se filtran solo los usuarios que pertenecen al proyecto y se recuperan sus datos
                this.users = this.allUsers.filter((user) => this.project.teamMembers.includes(user.uid));
            }
            console.log("Project selected: ", this.project);
            this.project.teamMembers.push(this.project.author);
            this.isDisabledSelectProject = true;
            this.isProjectSelected = true;
        },
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
            this.task.projectId = this.project.id;
            const res = await createATask(this.task);


            if (res != "Error") {
                await this.$swal({
                    title: "¡Task created successfully!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });

                this.$router.push('/admin/task/');

            } else {
                await this.$swal({
                    title: "An error ocurred at create task.",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                this.$router.push('/admin/task/new');

            }
            return;

        }
    },
    async mounted() {
        //Recuperamos la lista de proyectos
        this.projects = await getProjects();

        //Recuperamos todos los usuarios con sus atributos
        this.allUsers = await getUsers();

        //Cambiamos el author para que muestre el nombre y el apellido del creador
        for (let i = 0; i < this.projects.length; i++) {
            this.allUsers.filter((user) => {
                if (user.uid == this.projects[i].author) {
                    this.projects[i].author = user.name + " " + user.surname;
                }
            });
        }
    },
}
</script>

<style>
#carHeaderTHead{
    width: 100% !important;
    height: 60px !important;

    background-color: rgb(40, 40, 40);
    color: white;
}

#cardSelectProject {
    height: 280px;
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
    height:fit-content !important;
    
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