import { createTask, getTasksOfProject, getTask, getAllTasks, deleteTaskById, updateTask, makeComment, getComments, deleteComment } from "../models/tasksModel.js";


const createATask = async (taskData) => {
    const res = await createTask(taskData);

    if (res === null) {
        console.error("Error al crear tarea.");
        return "Error";
    }
    return res;
}

const getTasksOfAProject = async (projectId) => {
    const tasks = await getTasksOfProject(projectId);

    if (tasks === "Error fetching tasks") {
        console.error("Error al llamar función getTasksOfProject en tasksController, la respuesta dió error.");
        return "Error";
    }

    return tasks;
}

const getTaskById = async (id) => {
    const task = await getTask(id);

    if (task === "Error fetching task") {
        console.error("Error al llamar función getTaskById en taskController, la respuesta dió error.");
        return "Error";
    }

    console.log("Tarea recuperada: ", task);
    return task;
}

const getTasks = async () => {
    try {
        const tasks = await getAllTasks();

        if (!tasks) {
            console.error("Error getting tasks");
            return false;
        }

        return tasks;
    } catch (error) {
        console.error(error);
        return false;
    }

}

const deleteTask = async (id) => {
    try {
        const res = await deleteTaskById(id);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateTaskById = async (id, data) => {
    try {
        const res = await updateTask(id, data);

        if (!res) {
            throw new Error("¡Unknow Error!");
        }
        return true;
    }catch(error){
        return false;
    }
    
}

const addComment = async (taskId, comment, userId) => {
    try {
        const res = await makeComment(taskId, comment, userId);

        if (!res) {
            throw new Error("¡Unknow Error!");
        }
        return true;
    }catch(error){
        return false;
    }
    
}

const getAllComments = async (id) => {
    try {
        const tasks = await getComments(id);

        if (!tasks) {
            console.error("Error getting comments");
            return false;
        }

        return tasks;
    } catch (error) {
        console.error(error);
        return false;
    }

}

const deleteCommentOfTask = async (taskId, comment, userId) => {
    try {
        const res = await deleteComment(taskId, comment, userId);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { createATask, getTasksOfAProject, getTaskById, getTasks, deleteTask, updateTaskById, addComment, getAllComments, deleteCommentOfTask};