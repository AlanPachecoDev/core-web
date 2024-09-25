<template>
    <div class="banner">
        <img class="bannerImage" alt="ProjectBanner" src="../../../assets/images/BannerprojectStatistics.jpg">
    </div>
    <el-row :class="showMore ? 'rowTaskShowMore' : 'rowTask'">
        <div class="newTaskSection">
            <i @click="goToAddNewTask(this.$route.params.id)" class="mdi mdi-text-box-plus mdi-36px iconBtn"> Task</i>
        </div>

        <div class="statisticsRight">
            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Tareas:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ numberOfTasks }}</p>
                </div>

            </div>

            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Progreso:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ progress }}%</p>
                </div>
            </div>

            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Eficacia:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ efficiency }}%</p>
                </div>
            </div>

            <!-- <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Horas promedio tarea:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ hoursAverage }}</p>
                </div>

            </div> -->

            <div class="showMore">
                <i @click="() => { showMore = !showMore }"
                    :class="showMore ? 'mdi-chevron-up-circle' : 'mdi-chevron-down-circle'"
                    class="mdi  mdi-36px iconBtn"></i>
            </div>


        </div>




    </el-row>

    <!-- <el-row class="rowTask" v-if="showMore">
        <div class="statistics">


            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Tareas a tiempo:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ progress }}%</p>
                </div>
            </div>

            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Eficacia:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ efficiency }}%</p>
                </div>
            </div>

            <div class="statisticCard">
                <div class="statisticsCardLeft">
                    <p>Rapidez:</p>
                </div>
                <div class="statisticsCardRight">
                    <p>{{ speed }}%</p>
                </div>
            </div>
        </div>
    </el-row> -->

    <h1>Creadas por mi</h1>

    <div class="row">
        <article v-for="task in ownTasks" :key="task.id" class="imageCard projectCard hoverBtn"
            @click="goToViewTask(task.id)">
            <img src="../../../assets/images/Task.png" />
            <div class="galleryDivisionContainer">
                <div class="galleryDivisionLeft galleryProject">
                    <p>{{ task.name }}</p>
                    <p>{{ task.teamName }}</p>
                </div>
                <div class="galleryDivisionRight">
                    <i @click="goToViewTask(task.id)" class="mdi mdi-briefcase-eye mdi-36px iconBtn"></i>
                </div>
            </div>
        </article>
    </div>

    <h1>Tareas Creadas</h1>
    <div class="row">
        <article v-for="task in allTasks" :key="task.id" class="imageCard projectCard hoverBtn"
            @click="goToViewTask(task.id)">
            <img src="../../../assets/images/TaskAll.png" />
            <div class="galleryDivisionContainer">
                <div class="galleryDivisionLeft galleryProject">
                    <p>{{ task.name }}</p>
                    <p>{{ task.teamName }}</p>
                </div>
                <div class="galleryDivisionRight">
                    <i @click="goToViewTask(task.id)" class="mdi mdi-briefcase-eye mdi-36px iconBtn"></i>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import { getTasksOfAProject } from '../../../controllers/tasksController.js';
import { useUserStore } from "../../../stores/userStore";
import { getProjectById } from '../../../controllers/projectsController.js';

export default {
    data() {
        return {
            project: {},
            projectMembers: [],
            allTasks: [],
            ownTasks: [],
            numberOfTasks: 0,
            progress: 0,
            efficiency: 0,
            hoursAverage: 0,
            bestMember: "",

            showMore: false,
        }
    },
    methods: {
        goToAddNewTask(id) {
            this.$router.push({ name: "newTask", params: { id } });
        },
        goToViewTask(id) {
            this.$router.push({ name: "task", params: { id } });
        },
        substractDates(fecha1, fecha2) {
            const fechaInicioParts = fecha1.split("/");
            const fechaFinParts = fecha2.split("/");

            // El formato del array resultante es [DD, MM, AAAA]
            const fechaInicio = new Date(
                fechaInicioParts[2],
                fechaInicioParts[1] - 1,
                fechaInicioParts[0]
            );
            const fechaFin = new Date(fechaFinParts[2], fechaFinParts[1] - 1, fechaFinParts[0]);

            // Convertir las fechas a milisegundos
            const tiempoInicio = fechaInicio.getTime();
            const tiempoFin = fechaFin.getTime();

            // Calcular la diferencia en milisegundos
            const diferenciaMs = tiempoFin - tiempoInicio;

            // Convertir la diferencia a días y redondear al entero más cercano
            const unDiaEnMs = 24 * 60 * 60 * 1000; // Número de milisegundos en un día
            const diferenciaDias = Math.round(diferenciaMs / unDiaEnMs);

            return diferenciaDias;
        }


    },
    async mounted() {

        //Recuperamos el proyecto
        this.project = await getProjectById(this.$route.params.id);
        console.log("this.project: ", this.project);
        const store = useUserStore();
        const user = store.getUser;


        this.allTasks = await getTasksOfAProject(this.$route.params.id);

        this.numberOfTasks = this.allTasks.length;


        //--------------------------CORE-FUNCTIONS-------------------------- 
        //-----------------------------PROGRESS-----------------------------

        let taskValue = 100 / this.numberOfTasks;

        this.allTasks.forEach((task) => {
            task.objectiveValue = taskValue / task.objectives.length;

            task.objectives.forEach((objective) => {
                this.progress += parseFloat((parseInt(objective.state.slice(0, -1)) * (task.objectiveValue / 100)).toFixed(1));
                this.progress >= 100 ? this.progress = 100 : this.progress = this.progress;
            });
        });


        //-----------------------------EFFECTIVENESS-----------------------------

        //Me permite saber si todas las operaciones dan como resultado NaN, esto en caso de que ninguna tarea se haya completado aún
        let NAN = true;

        //Del 100 del proyecto, se reparte una métrica equitativa para todas las tareas, este será el valor de eficiencia que se le asigne 
        //a cada día
        const efficiencyPerTask = 100 / this.allTasks.length;

        this.allTasks.forEach((task) => {

            //Es la diferencia entre la fecha de fin estimada y la fecha real
            //Si la diferencia es positiva, entonces se suma eficiencia por cada día ahorrado según lo previsto
            //Si la diferencia es negativa, se resta la eficiencia por día
            const diff = this.substractDates(task.endDate, task.estimatedEndDate);

            //si la diferencia es cero entonces no se suma nada
            if (diff == 0) {
                return;
            }

            //Cantidad total de días que se tenía planificado trabajar
            const numberOfDays = this.substractDates(task.startDate, task.estimatedEndDate);
            //Se calcula el valor para cada día repartiendo el valor de eficiencia por tarea para cada día de trabajo de dicha tarea
            const efficiencyValuePerDay = efficiencyPerTask / numberOfDays;

            //Si diff es un número válido se hacen todas las operaciones
            //Puede ser un NaN si la tarea aún no se ha finalizado
            if (diff) {
                NAN = false;
                //la eficiencia de esta tarea se obtiene multiplicando el valor de eficiencia diario por el número de días 

                //Si se ahorraron días el resultado será positivo y se sumará, sino, será negativo y restará
                let efficiencyCalc = efficiencyValuePerDay * diff;

                //Validar valores

                //Si el valor positivo es mayor a la eficiencia asignada para esta tarea, entonces se asgina el valor 
                //asignado de esta tarea, pues sería el máximo que puede alcanzar.
                if (efficiencyCalc > efficiencyPerTask) {
                    efficiencyCalc = efficiencyPerTask
                } else if (efficiencyCalc < (-1 * efficiencyPerTask)) {
                    //Si en cambio, supera el umbral del míninmo, se establece a este como la versión negativa dela eficiencia de la tarea
                    efficiencyCalc = (-1 * efficiencyPerTask)
                }

                //Nos aseguramos de estar trabajando con valores flotantes
                this.efficiency = parseFloat(this.efficiency);

                //Sumamos la eficiencia de cada tarea al total del proyecto
                this.efficiency += efficiencyCalc;

                //Redondeamos a un decimal
                this.efficiency = this.efficiency.toFixed(1)
            }

        });

        //Si ninguna tarea ha sido marcada como completa, no se puede medir la eficiencia, por lo que, se muestra un valor nulo
        if (NAN) {
            this.efficiency = 0;
        }

        //Sacar la eficacia de usuarios en un rango de fechas
        
        //En base a tareas activas en el rango de fecha




        //-----------------------------hoursAverage-----------------------------
        // this.allTasks.forEach((task) =>{
        //     const totalDays = this.substractDates(task.startDate, task.endDate);
        //     const hours = totalDays*8;
        // });

        //-----------------------------bestMember-----------------------------
        //se forma un ranking de usuarios por la cantidad de objetivos que ha marcado como completos,
        //Cada objetivo tendrá un porcentaje que represente con respecto al total de la tarea
        //El usuario que tenga un mayor porcentaje sobre el cien porciento será el que esté en el puesto 1

        //Recuperamos los usuarios en este proyecto
        // this.projectMembers = this.project.teamMembers.concat(this.project.author);
        // this.projectMembers.forEach((member) => {
        //     member = { projectMember: member, countObjectives: 0 }
        // });
        // console.log("this.projectMembers: ", this.projectMembers);
        // this.allTasks.forEach((task) => {
        //     console.log("task: ", task);
        //     task.objectives.forEach((objective) => {
        //         objective.members.forEach((member) => {
        //             console.log("Member: ", member);
        //             this.projectMembers.forEach((projectMember) => {
        //                 if (member === projectMember) {
        //                     console.log("projectMember coincide: ", projectMember);
        //                     let lastValue = projectMember["countObjectives"] ? projectMember["countObjectives"] : 0;
        //                     console.log("lastValue: ", lastValue);
        //                     projectMember = { projectMember, countObjectives: lastValue + 1 };

        //                     console.log("projectMember: ", projectMember);
        //                 }
        //             });
        //             console.log(`this.projectMembers: ${this.projectMembers}`);
        //         });
        //     });
        // });


        //--------------------------CORE-FUNCTIONS-------------------------- 


        this.ownTasks = this.allTasks;
        this.ownTasks = this.allTasks.filter((task) => {
            if (task.author == user.id) {
                return task;
            }
        });

        const aux = this.allTasks.filter((task) => {
            if (task.author != user.id) {
                return task;
            }
        })

        this.allTasks = aux;
    }
}
</script>

<style>
.btnNewTask {
    font-size: 2rem;
}

.rowTask {
    width: 100%;
    height: 200px;
    margin-bottom: 0px;
    border-bottom: 1px solid rgb(190, 190, 190);
    margin: 0px 10px 50px 10px !important;
}

.rowTaskShowMore {
    width: 100%;
    height: 200px;
    margin-bottom: 0px;
    margin: 0px 10px 50px 10px !important;
}

.newTaskSection {
    width: 15%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.showMore {
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.statisticsRight {
    width: 85%;
    height: 100%;

    display: flex;
    justify-content: space-around;
    align-items: center;
}

.statistics {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: space-around;
    align-items: center;
}

.statisticCard {
    display: flex;
    flex-direction: row;
    width: 20%;
    padding: 0px;

    height: 75px;
    background-color: rgb(82, 82, 81);

    border-radius: 10px;
}

.statisticsCardLeft {
    /* display: inline-block; */
    width: 50%;
    height: 100%;
    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;
}

.statisticsCardLeft p {
    font-size: large;
    font-weight: bold;
}

.statisticsCardRight {
    /* display: inline-block; */
    width: 50%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.statisticsCardRight p {
    font-size: 170%;
    font-weight: bold;
}
</style>