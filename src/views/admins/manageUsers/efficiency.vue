<template>
    <div class="visibleArea">
        <h1>
            Efficiency
        </h1>

        <div class="inputContainer">
            <v-card-subtitle class="subtitle">Fecha Inicio</v-card-subtitle>
            <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
            <el-date-picker v-model="startDate" class="datePicker" format="DD/MM/YYYY" value-format="DD/MM/YYYY" type="date"
                placeholder="Fecha De Inicio Del Análisis"></el-date-picker>
        </div>

        <div class="inputContainer">
            <v-card-subtitle class="subtitle">Fecha Fin</v-card-subtitle>
            <!-- <el-input v-model="user.birthdate" @input="validate('birthdate')" placeholder="Your birthdate" required /> -->
            <el-date-picker v-model="endDate" class="datePicker" format="DD/MM/YYYY" value-format="DD/MM/YYYY" type="date"
                placeholder="Fecha De Fin Del Análisis"></el-date-picker>
        </div>

        <div class="containerButton">
            <el-button @click="calculate()" class="btnNewTask" type="primary"> +
                Ver Eficiencia</el-button>

        </div>

        <div v-if="calculated">
            <div v-for="project in userProjects" :key="project.id">
                <div>
                    <h2>
                        {{ project.name }}
                    </h2>
                    <p>
                        Eficiencia: {{ project.efficiency }}
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import { getUserById } from '../../../controllers/usersController.js';
import { getProjects } from '../../../controllers/projectsController.js';
import { getTasksOfAProject } from '../../../controllers/tasksController.js';

export default {
    data() {
        return {
            calculated: false,
            startDate: "05/11/1990",
            endDate: "05/11/3000",
            allProjects: [],
            userProjects: [],
            user: {},
        }

    },
    async created() {
        this.user = await getUserById(this.$route.params.id);
        console.log("this.user: ", this.user);
        this.allProjects = await getProjects();
        console.log("this.allProjects: ", this.allProjects);

    },
    methods: {
        async calculate() {
            this.calculated = false;
            this.userProjects = [];
            console.log("startDate: ", this.startDate);
            console.log("endDate: ", this.endDate);
            if (this.startDate == "" || this.endDate == "") {
                return;
            }
            //COREEEEEEEE
            //1. Primero recuperar los proyectos en los que participa este usuario
            //1.1 filtrar los proyectos de solo este usuario
            this.allProjects.forEach((project) => {
                if (project.author == this.user.uid) {
                    this.userProjects.push(project);
                } else if (project.teamMembers.includes(this.user.uid)) {
                    //Se verifica si es miembro de alguno del proyecto
                    this.userProjects.push(project);
                }
            });

            console.log("User projects: ", this.userProjects);

            //Luego recuperar las tareas de cada proyecto en las que participa el usuario
            for (const project of this.userProjects) {
                let userTasks = [];

                // Recuperamos las tareas de este proyecto del controlador
                const tasks = await getTasksOfAProject(project.id);

                for (const task of tasks) {
                    // Si el usuario es miembro asignado de la tarea
                    if (task.members.includes(this.user.uid)) {

                        //Si a parte de ser miembro, la fecha de conclusión de la tarea está entre el rango de fechas dadas
                        const isInRange = this.isInTheDateRange(this.startDate, this.endDate, task.endDate);
                        console.log("this.startDate, this.endDate, task.endDate: ", this.startDate, this.endDate, task.endDate);
                        console.log("isInRange: ", isInRange);
                        if (isInRange) {
                            console.log("isInTheDateRange");
                            //Si está en el rango se agrega la tarea
                            userTasks.push(task);
                        }

                    }
                }

                // Ahora, iteramos sobre cada objetivo de cada tarea
                for (const task of userTasks) {
                    let userObjectives = [];

                    for (const objective of task.objectives) {
                        if (objective.members.includes(this.user.uid)) {
                            userObjectives.push(objective);
                        }
                    }

                    // Se reemplazan los objetivos de la tarea para que solo queden los objetivos en los que participa el usuario
                    task.objectives = userObjectives;
                }

                // Luego combinamos cada proyecto para que tenga las tareas dentro de cada objeto
                project.tasks = userTasks;
            }

            console.log("this.userProjects: ", this.userProjects);

            //Depuramos para que solo estén las tareas de ese usuario

            //Cada tarea contiene solo los objetivos de ese usuario

            //Cada tarea tiene startDate, endDate, estimatedEndDate y objetivos (solo de ese usuario)

            //Depuro Para que me tome solo las tareas que fueron completadas en el rango de fechas dado

            //Calculo el nivel de eficiencia con la misma fórmula pero tomando como referente la fecha de finalización de cada objetivo
            //, por eso es necesario depurar para que las tareas
            //solo sean del usuario seleccionado y en el rango de fechas dado.

            //Se muestra el porcentaje de eficiencia en el rango de fechas dado pero por cada pryecto por separado

            //Se puede mostrar al final un promedio de eficiencia entre todos los proyectos.


            //-----------------------------EFFECTIVENESS-----------------------------

            //Calculamos el porcentaje de eficiencia por proyecto
            this.userProjects.forEach((project, index) => {
                let efficiency = 0;
                //Me permite saber si todas las operaciones dan como resultado NaN, esto en caso de que ninguna tarea se haya completado aún
                let NAN = true;

                //Del 100 del proyecto, se reparte una métrica equitativa para todas las tareas, este será el valor de eficiencia que se le asigne 
                //a cada día
                console.log("TAAAASKs: ", project);
                const efficiencyPerTask = 100 / project.tasks.length;

                project.tasks.forEach((task) => {

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
                        efficiency = parseFloat(efficiency);

                        //Sumamos la eficiencia de cada tarea al total del proyecto
                        efficiency += efficiencyCalc;

                        //Redondeamos a un decimal
                        efficiency = efficiency.toFixed(1)
                    }

                });

                //Si ninguna tarea ha sido marcada como completa, no se puede medir la eficiencia, por lo que, se muestra un valor nulo
                if (NAN) {
                    efficiency = 0;
                }
                //Se setea la eficiencia de este proyecto
                this.userProjects[index] = { ...project, efficiency };

                console.log("Efficiency project: ", project);

            });
            console.log("Efficiency this.userProjects: ", this.userProjects);
            this.calculated = true;

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
        },
        isInTheDateRange(fechaInicial, fechaFinal, fecha) {
            try {
                // Extraer día, mes y año de las fechas
                const [diaInicial, mesInicial, anioInicial] = fechaInicial.split("/");
                const [diaFinal, mesFinal, anioFinal] = fechaFinal.split("/");
                const [dia, mes, anio] = fecha.split("/");

                // Crear objetos de fecha en el formato correcto (mes - 1 porque los meses en JavaScript son base 0)
                const fechaInicialObj = new Date(anioInicial, mesInicial - 1, diaInicial);
                const fechaFinalObj = new Date(anioFinal, mesFinal - 1, diaFinal);
                const fechaObj = new Date(anio, mes - 1, dia);

                return fechaObj >= fechaInicialObj && fechaObj <= fechaFinalObj;
            } catch (error) {
                console.error("isInTheDateRange error: ", error);
                return false;

            }

        }
    }
}

</script>