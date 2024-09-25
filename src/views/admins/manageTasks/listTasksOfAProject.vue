
<style></style>
<template >
    <div class="visibleArea">
        <v-card class="cardList">
            <div class="cardHeader">
                <h2>Tasks of: {{this.project.name}}</h2>
            </div>
            <div class="headerOptions">
                <div class="headerOptionsLeft">
                    <div class="input-container">
                        <input type="text" required="" v-model="buscar" />
                        <label>Search by name</label>
                    </div>
                </div>
                <div class="headerOptionsRight">
                    <div class="containerBtn">
                        <p>New</p>
                        <i @click="goToNewTask()" class="mdi mdi-plus-box mdi-36px iconBtn"></i>
                        
                    </div>

                </div>

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
                    <tr v-for="(task, index) in tasksToShow" :key="index">
                        <td>{{ task.author }}</td>
                        <td>{{ task.name }}</td>
                        <td>{{ task.description }}</td>
                        <td>{{ task.startDate }}</td>
                        <td>{{ task.estimatedEndDate }}</td>
                        <td>{{ task.state }}</td>
                        <!-- Objetivos y miembros se muestran en otra ventana -->
                        <td>
                            <i class="mdi  mdi-text-box-edit mdi-36px iconBtn" @click="goToEditTask(task.id)"></i>
                        </td>
                        <td>
                            <i class="mdi mdi-text-box-remove mdi-36px iconBtn" @click="deteleTask(task.id)"></i>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>
  
<style></style>

<script>
//Función que retorna los usuarios registrados
import { getTasksOfAProject, deleteTask } from '../../../controllers/tasksController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { getProjectById } from '../../../controllers/projectsController.js';
export default {
    data() {
        return {
            project: {},
            users: [],
            tasks: [],
            tasksToShow: [],
            loading: true,
            buscar: "",
        };
    },
    watch: {
        buscar(newValue, oldValue) {
            const newTasks = this.tasks.filter((task) => {
                if (task.name.toLowerCase().includes(newValue.toLowerCase())) {
                    return task;
                }
            });
            this.tasksToShow = newTasks;
        }
    },
    methods: {
        goToNewTask() {
            this.$router.push('/admin/task/new');
        },
        goToEditTask(id) {
            this.$router.push({ name: "editTask", params: { id } });
        },
        deleteTaskOfList(id) {
            this.tasks = this.tasks.filter((task) => {
                if (task.id != id) {
                    return task;
                }
            });

            this.tasksToShow = Object.assign({}, this.tasks);
        },
        async deteleTask(id) {
            const result = await this.$swal({
                title: '¿Are you sure to delete this task?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: "Not",
            });
            if (result.isConfirmed) {
                this.deleteTaskOfList(id)
                const res = await deleteTask(id);

                if (res) {
                    await this.$swal({
                        title: "Task deleted successfully!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                } else {
                    await this.$swal({
                        title: "Task not deleted!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            }
        }
    },
    async mounted() {
        //Recuperamos el proyecto 
        this.project = await getProjectById(this.$route.params.id);
        //Recuperamos los usuarios
        this.users = await getUsers();
        //Usamos el controlador para recuperar los usuarios
        this.tasks = await getTasksOfAProject(this.$route.params.id);


        for (let i = 0; i < this.tasks.length; i++) {
            this.users.filter((user) => {
                if (user.uid == this.tasks[i].author) {
                    this.tasks[i].author = user.name + " " + user.surname;
                }
            });
        }
        this.tasksToShow = Object.assign({}, this.tasks);
        this.loading = false;

    }
}
</script>