<template>
    <div class="visibleArea">
        <div id="pagewrap">
            <div class="gallery">
                <article class="imageCard">
                    <img src="../../assets/images/admin/gestionarUsuarios.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft">
                            <p>Users</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goManageUsers()" class="mdi mdi-account-box mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>

                <article class="imageCard">
                    <img src="../../assets/images/admin/gestionarProyectos.jpg" />
                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft">
                            <p>Projects</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goManageProjects()" class="mdi mdi-briefcase mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>

                <article class="imageCard">
                    <img src="../../assets/images/admin/gestionarTareas.jpg" />

                    <div class="galleryDivisionContainer">
                        <div class="galleryDivisionLeft">
                            <p>Tasks</p>
                        </div>
                        <div class="galleryDivisionRight">
                            <i @click="goManageTasks()" class="mdi mdi-text-box mdi-36px iconBtn"></i>
                        </div>
                    </div>
                </article>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        goManageUsers() {
            this.$router.push('/admin/users');
        },
        goManageProjects() {
            this.$router.push('/admin/project/');
        },
        goManageTasks() {
            this.$router.push('/admin/task/');
        }
    }
}
</script>

<style>


* {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
    -moz-box-sizing: border-box;
    margin: 0;
    padding: 0;

}

body {
    font-size: 16px;
    font-family: monospace, "Helvetica Neue", Helvetica, Verdana, sans-serif;
    background-color: #1abc9c;
    text-align: center;
    color: #666;
}





/*@media (max-width: 900px){
 .image{
  width: 45%;
 }
  .gallery{
    padding: 10vh 1vh;
  }
}

@media (max-width: 600px){
 .image{
  width: 50%;
 }
}*/
</style>