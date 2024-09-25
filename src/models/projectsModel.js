//Ruta para la api
const RUTA_SERVIDOR = `${import.meta.env.VITE_APP_RUTA_API}`;

async function createProject(projectData) {
    try {
      const { author, teamName, name, description, teamMembers, estimatedEndDate } = projectData;
  
      const response = await fetch(`${RUTA_SERVIDOR}/projects/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, teamName, name, description, teamMembers, estimatedEndDate })
      });

      if (!response.ok) {
        throw new Error('Error creating project');
      }

      const project = response;
      return project;

    } catch (error) {
      throw error;
    }
  }

  const getAllProjects = async () => {
    try {
      const response = await fetch(`${RUTA_SERVIDOR}/projects/`);
      if (!response.ok) {
        throw new Error('Error fetching projects');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getProject = async (id) => {
    try {
      const response = await fetch(`${RUTA_SERVIDOR}/projects/project/${id}`);
      if (!response.ok) {
        throw new Error(`Unable to get project ${id}`);
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  };

  async function deleteProjectById(id) {
    try {
      const response = await fetch(`${RUTA_SERVIDOR}/projects/delete/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error deleting project.');
      }
  
      const data = await response.text();
      return data;
  
    } catch (error) {
      throw error;
    }
  }


  const updateProject = async (id, projectData) => {
  try {

    const { description, state, estimatedEndDate, name, startDate, teamMembers, teamName } = projectData;
    const response = await fetch(`${RUTA_SERVIDOR}/projects/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, description, state, estimatedEndDate, name, startDate, teamMembers, teamName })
    });

    if (!response.ok) {
      throw new Error('Error updating project');
    }
    return response.ok;

  } catch (error) {
    throw error;
  }
};

export { createProject, getAllProjects, getProject, deleteProjectById, updateProject };