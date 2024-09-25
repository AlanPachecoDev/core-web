
<template>
    <div v-if="loading">Loading...</div>

    <div v-if="!loading">

        <div id="pagewrap">
            <div class="gallery">
                <!-- <div class="cardContainer"> -->
                <article class="imageCard hoverBtn" @click="goToAddNewProject()">
                    <img src="../../assets/images/NewProject.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft galleryProject">
                            <p>Nuevo Proyecto</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goToAddNewProject()" class="mdi mdi-briefcase-plus mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>

                <article class="imageCard hoverBtn" @click="goToDeleteProject()">
                    <img src="../../assets/images/DeleteProject.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft galleryProject">
                            <p>Eliminar Proyecto</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goToDeleteProject()" class="mdi mdi-briefcase-remove mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <div class="rowsContainer">

            <h1>Creados por mi</h1>

            <div class="row">
                <article v-for="project in ownProjects" :key="project.id" class="imageCard projectCard hoverBtn" @click="goToViewProject(project.id)">
                    <img src="../../assets/images/MyProjects.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft galleryProject">
                            <p>{{ project.name }}</p>
                            <p>{{ project.teamName }}</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goToViewProject(project.id)" class="mdi mdi-briefcase-eye mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>
            </div>

            <h1>En los que participo</h1>

            <div class="row">
                <article v-for="project in projects" :key="project.id" class="imageCard projectCard hoverBtn" @click="goToViewProject(project.id)">
                    <img src="../../assets/images/OtherProjects.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft galleryProject">
                            <p>{{ project.name }}</p>
                            <p>{{ project.teamName }}</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goToViewProject(project.id)" class="mdi mdi-briefcase-eye mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>

import { getProjectsList } from '../../controllers/projectsController.js';

import { useUserStore } from "../../stores/userStore";

export default {
    data() {
        return {
            loading: true,
            ownProjects: [],
            projects: [],
        }
    },
    methods: {
        goToAddNewProject() {
            this.$router.push('/addNewProject');
        },
        goToDeleteProject() {
            this.$router.push('/deleteProject');
        },
        goToViewProject(id) {
            this.$router.push({ name: "project", params: { id } });
        }
    },
    async mounted() {

        const store = useUserStore();
        const user = store.getUser;

        const listProjects = await getProjectsList(user.id);

        this.ownProjects = listProjects.ownProjects;
        this.projects = listProjects.projects;

        this.loading = false;

    }
}
</script>

<style>
#portadaContainer {
    width: 475px;
    height: 300px;

    /* border-radius: 100%; */

}


#imagenPortada {
    width: 100%;
    height: 100%;
    /* filter: blur(5px); */
}

/* Agregar nuevo proyecto */
#cardNewProject {
    width: 150px;
    height: 200px;

    margin-right: 20%;
    overflow: hidden;
}

.imageAddNew {
    width: 100% !important;
}

/* ----------- */
.imageProjectContainer {
    display: flex;
    width: 100%;

    justify-content: center;
}

.imageProject {
    width: 75%;
}
</style>
