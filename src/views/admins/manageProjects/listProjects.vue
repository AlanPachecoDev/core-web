
<style></style>
<template >
    <div class="visibleArea">
        <v-card class="cardList">
            <div class="cardHeader">
                <h2>List of projects</h2>
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
                        <i @click="goToNewProject()" class="mdi mdi-plus-box mdi-36px iconBtn"></i>
                        
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
                        <th class="text-left">Team Name</th>
                        </td>
                        <td>
                        <th class="text-left">State</th>
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

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(project, index) in projectsToShow" :key="index">
                        <td>{{ project.author }}</td>
                        <td>{{ project.name }}</td>
                        <td>{{ project.teamName }}</td>
                        <td>{{ project.state }}</td>
                        <td>{{ project.description }}</td>
                        <td>{{ project.startDate }}</td>
                        <td>{{ project.estimatedEndDate }}</td>
                        <td>
                            <i class="mdi mdi-briefcase-edit mdi-36px iconBtn" @click="goToEditProject(project.id)"></i>
                        </td>
                        <td>
                            <i class="mdi mdi-briefcase-remove mdi-36px iconBtn" @click="deteleProject(project.id)"></i>
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
import { getProjects, deleteProject } from '../../../controllers/projectsController.js';
import { getUsers } from '../../../controllers/usersController.js';

export default {
    data() {
        return {
            users: [],
            projects: [],
            projectsToShow: [],
            loading: true,
            buscar: "",
        };
    },
    watch: {
        buscar(newValue, oldValue) {
            const newProjects = this.projects.filter((project) => {
                if (project.name.toLowerCase().includes(newValue.toLowerCase())) {
                    return project;
                }
            });
            this.projectsToShow = newProjects;
        }
    },
    methods: {
        goToNewProject() {
            this.$router.push('/admin/project/new');
        },
        goToEditProject(id) {
            this.$router.push({ name: "editProject", params: { id } });
        },
        deleteProjectOfList(id) {
            this.projects = this.projects.filter((project) => {
                if (project.id != id) {
                    return project;
                }
            });

            this.projectsToShow = Object.assign({}, this.projects);
        },
        async deteleProject(id) {
            const result = await this.$swal({
                title: '¿Are you sure to delete this project?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: "Not",
            });
            if (result.isConfirmed) {
                this.deleteProjectOfList(id)
                const res = await deleteProject(id);

                if (res) {
                    await this.$swal({
                        title: "¡Project deleted successfully!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                } else {
                    await this.$swal({
                        title: "¡Project not deleted!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            }
        }
    },
    async mounted() {
        //Recuperamos los usuarios
        this.users = await getUsers();
        //Usamos el controlador para recuperar los usuarios
        this.projects = await getProjects();


        for (let i = 0; i < this.projects.length; i++) {
            this.users.filter((user) => {
                if (user.uid == this.projects[i].author) {
                    this.projects[i].author = user.name + " " + user.surname;
                }
            });
        }
        this.projectsToShow = Object.assign({}, this.projects);
        this.loading = false;

    }
}
</script>