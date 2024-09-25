<template>
    <div class="visibleArea">
        <div class="taskHeader">
            <h1>{{ task.name }}</h1>
        </div>
        <div class="taskContent">
            <div class="taskObjective">
                <h2>Descripción</h2>
                <p>{{ task.description }}</p>
            </div>
            <h2>Otros objetivos</h2>
            <div class="objectiveRow" v-for="objective in otherObjectives" :key="objective.description">
                <p>🔵 {{ objective.description }}</p>
                <p style="padding-left: 2%;">Aignado a: {{ getNames(objective.members) }} ({{ objective.state }})</p>
            </div>
        </div>
        <div class="rowsContainer">
            <h1>Cambiar avance de la tarea</h1>
            <div class="inputContainerDate">
                <div class="containerDate">
                    <el-select class="selectInput" v-model="task.state">
                        <el-option label="On hold" value="On hold" />
                        <el-option label="On process" value="On process" />
                        <el-option label="QA" value="QA" />
                        <el-option label="Done" value="Done" />
                    </el-select>
                </div>
            </div>
            <div class="buttonRow">
                <i @click="updateTaskState()" class="mdi mdi-text-box-edit mdi-36px iconBtn">
                    Actualizar</i>
            </div>

        </div>

        <div class="rowsContainer">
            <h1>Mis Objetivos</h1>
            <div class="objectiveRow myObjectives" v-for="objective in myObjectives" :key="objective.description">
                <div class="myObjectivesContent">
                    <p>{{ objective.description }}</p>
                    <p>Aignado a: {{ getNames(objective.members) }}</p>
                </div>

                <div class="inputContainerDate objectiveSelect">
                    <h3>Estado</h3>
                    <div class="containerDate">

                        <el-select class="selectInput" v-model="objective.state">
                            <el-option label="0%" value="0%" />
                            <el-option label="10%" value="10%" />
                            <el-option label="20%" value="20%" />
                            <el-option label="30%" value="30%" />
                            <el-option label="40%" value="40%" />
                            <el-option label="50%" value="50%" />
                            <el-option label="60%" value="60%" />
                            <el-option label="70%" value="70%" />
                            <el-option label="80%" value="80%" />
                            <el-option label="90%" value="90%" />
                            <el-option label="100%" value="100%" />
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="buttonRow">
                <i @click="updateObjectives()" class="mdi mdi-text-box-edit mdi-36px iconBtn">
                    Actualizar</i>
            </div>

        </div>

        <div class="rowsContainer">
            <h1>Agregar comentario</h1>
            <div class="inputTextArea">
                <textarea class="textArea" v-model="comment" placeholder="Agrega un comentario" rows="4"
                    cols="50"></textarea>
            </div>
            <div class="buttonRow">
                <i @click="sendComment()" class="mdi mdi-comment-plus mdi-36px iconBtn">
                    Enviar</i>
            </div>

        </div>

        <div class="rowsContainer">
            <h1>Comentarios</h1>
            <div class="commentRow" v-for="comment in comments" :key="comment.comment">
                <p class="commentSide"> {{ getNames(comment.userId) }}: {{ comment.comment }}</p>
                <div class="deleteSide" v-if="user.id == comment.userId">
                    <i @click="deleteTaskComment(comment.comment)" class="mdi mdi-comment-remove mdi-36px iconBtn"></i>
                </div>
                <!-- <p style="padding-left: 7%;">Aignado a: {{ getNames(objective.members) }}</p> -->
            </div>
        </div>
    </div>
</template>

<script>
import { updateTaskById, getTaskById, addComment, getAllComments, deleteCommentOfTask } from '../../../controllers/tasksController.js';
import { getUsers } from '../../../controllers/usersController.js';
import { useUserStore } from "../../../stores/userStore";

//Patrón de diseño
import Subject from '../../../observer/Subject';
import { emailSender } from '../../../observer/Observer';

export default {
    data() {
        return {
            task: {},
            allUsers: [],
            comment: "",
            comments: [],
            otherObjectives: [],
            myObjectives: [],
            user: {},
            //Se crea el objeto que será observado en el patrón de diseño observer
            subjectTask: new Subject()
        }
        //On hold, On process, QA, Done.
    },
    async mounted() {
        this.subjectTask.registrarObservador(emailSender);
        const store = useUserStore();
        const user = store.getUser;
        this.user = user;
        this.task = await getTaskById(this.$route.params.id);

        console.log("task: ", this.task)

        this.otherObjectives = this.task.objectives.filter((objective) => {
            //si es miembro de este objetivo
            const isMember = objective.members.includes(this.user.id);
            if (!isMember) {
                return objective;
            }
        });

        this.myObjectives = this.task.objectives.filter((objective) => {
            //si es miembro de este objetivo
            const isMember = objective.members.includes(this.user.id);
            if (isMember) {
                return objective;
            }
        });

        //Recuperamos los usuarios
        this.allUsers = await getUsers();

        //Recuperamos los comentarios de esta tarea
        this.comments = await getAllComments(this.$route.params.id);

    },
    methods: {
        getNames(ids) {
            const usersNames = this.allUsers.filter((user) => ids.includes(user.uid));
            const names = usersNames.map(user => user.name + ' ' + user.surname);
            return names.join(", ");
        },
        async sendComment() {


            const res = await addComment(this.$route.params.id, this.comment, this.user.id);
            this.comments.push = { comment: this.comment, userId: this.user.id };
            this.comment = "";

            this.$forceUpdate();

            this.$router.go(0);
        },
        async updateTaskState() {
            if (this.task.state == "Done") {
                
                let showAlert = false;
                this.task.objectives.forEach((objective) => {
                    if (objective.state != "100%") {
                        showAlert = true;
                    }
                });
                if (showAlert) {
                    await this.$swal({
                        title: "¡Todos los objetivos deben haberse cumplido!",
                        text: "Para marcar una tarea como Done, todos sus objetivos deben estar al 100%",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                    return;
                }
            }
            const res = await updateTaskById(this.$route.params.id, this.task);

            if (res) {
                await this.$swal({
                    title: "¡El estado de la tarea se modificó correctamente!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                
                console.log("Patron observer    |     this.task: ", this.task);
                this.subjectTask.notificarCambio(this.task);



                
                //this.$router.go(0);


            } else {
                await this.$swal({
                    title: "¡El estado de la tarea NO se modificó correctamente!",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
            }
        },
        async updateObjectives() {
            //Unimos el arreglo de los objetivos del usuario actual con los delos otros usuarios
            //Así tenemos la totalidad de objetivos (Actualizados) y podemos actualizar todos los comentarios de la tarea

            const objectives = this.myObjectives.concat(this.otherObjectives);
            if (this.task.state == "Done") {
                this.myObjectives.forEach((objective) => {
                    if (objective.state != "100%") {
                        this.task.state = "On process";
                        this.task.endDate = "";
                    }
                }
                );
            }


            const data = {
                name: this.task.name, description: this.task.description, estimatedEndDate: this.task.estimatedEndDate,
                members: this.task.members, objectives, state: this.task.state
            };
            const res = await updateTaskById(this.$route.params.id, data);

            if (res) {
                await this.$swal({
                    title: "¡El estado de los objetivos se modificó correctamente!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                this.$router.go(0);
            } else {
                await this.$swal({
                    title: "¡El estado de los objetivos NO se modificó correctamente!",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
            }
        },
        async deleteTaskComment(comment) {
            const result = await this.$swal({
                title: '¿Estás seguro de eliminar el comentario?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: "No",
            });
            if (result.isConfirmed) {
                const res = await deleteCommentOfTask(this.$route.params.id, comment, this.user.id);
                console.log("res eliminar: ", res);

                if (res != false) {
                    await this.$swal({
                        title: "¡El comentario se eliminó correctamente!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                    this.$router.go(0);
                } else {
                    await this.$swal({
                        title: "¡El comentario NO se eliminó correctamente!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            }
        }
    }

}
</script>

<style>
.myObjectives {
    background-color: rgb(77, 77, 77);
    border: none !important;
    padding: 1% 0px !important;
    margin: 1% !important;

    display: flex;


}

.myObjectivesContent {
    width: 350%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.objectiveSelect {
    margin: 1%;

    display: flex;
    flex-direction: column;
    align-items: center;
}


.selectInput {
    width: 100% !important;
    height: max-content !important;
}

.taskHeader {
    padding: 2.5%;
    margin: 10px 0px;
    background-color: rgb(82, 82, 81);
    color: white;

    height: fit-content;
}

.taskContent {
    text-align: left;
    padding: 2.5%;
    margin: 10px 0px;
    background-color: rgb(57, 57, 57);
}

.taskObjective {
    padding: 2.5% 0px;
}

.objectiveRow {
    padding: 2.5% 0px;
    border-bottom: 1px solid white;
}
</style>

