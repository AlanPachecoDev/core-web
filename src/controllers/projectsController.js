import { createProject, getAllProjects, getProject, deleteProjectById, updateProject } from "../models/projectsModel.js";

const createAProject = async (userData) => {
    try {
        const res = await createProject(userData);

        if (!res) {
            console.error("Error creating project.");
            return false;
        }
        return res;
    } catch (error) {
        console.error(error);
        return false;
    }

}

const getProjects = async () => {
    try {
        const projects = await getAllProjects();

        if (!projects) {
            console.error("Error getting projects");
            return false;
        }

        return projects;
    } catch (error) {
        console.error(error);
        return false;
    }

}

const getProjectsList = async (id) => {

    try {
        const allProjects = await getProjects();

        if (!allProjects) {
            console.error("Error getting projects");
            return false;
        }

        const ownProjects = allProjects.filter(project => project.author == id);

        const projects = allProjects.filter(project => {
            let participa = false;

            for (let i = 0; i < project.teamMembers.length; i++) {
                //Si al menos un id de los participantes coincide con el id enviado
                //Entonces se agrega el proyecto
                if (project.teamMembers[i] == id) {
                    participa = true;
                    break;
                }
            }

            if (participa) {
                return project;
            }
            return false;
        });


        const projectsList = {
            ownProjects,
            projects
        }

        return projectsList;
    } catch (error) {
        return false;
    }

}

const getProjectById = async (id) => {
    try {
        const project = await getProject(id);

        if (!project) {
            console.error("Error getting project.");
            return false;
        }

        return project;
    } catch (error) {
        console.error(error);
        return false;
    }

}

const getProjectsByUser = async (id) => {

    try {
        const allProjects = await getProjects();

        if (!allProjects) {
            console.error("Error getting projects");
            return false;
        }

        //Devuelve únicamente los proyectos que han sido creados por el usuario
        const ownProjects = allProjects.filter(project => project.author == id);

        return ownProjects;
    } catch (error) {
        return false;
    }

}

const deleteProject = async (id) => {
    try {
        const res = await deleteProjectById(id);
        return res;
    } catch (error) {
        console.error(error);
        return false;
    }


}

const updateProjectById = async (id, data) => {
    try {
        const res = await updateProject(id, data);

        if (!res) {
            throw new Error("¡Unknow Error!");
        }
        return true;
    }catch(error){
        return false;
    }
    
}

export { createAProject, getProjects, getProjectsList, getProjectById, deleteProject, updateProjectById, getProjectsByUser };