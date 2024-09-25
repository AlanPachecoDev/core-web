import { getUserById } from "../controllers/usersController.js";

import { getProjectById } from "../controllers/projectsController.js";

import { sendEmail } from "../models/usersModel.js";

// Clase Observador
class Observer {
  constructor(nombre) {
    this.nombre = nombre;
  }

  // Método de actualización que será invocado por el sujeto
  async actualizar(task) {
    let members = [];

    if (!task.members.includes(task.author)) {
      task.members.push(task.author);
    }

    try {
      for (const member of task.members) {
        let res = await getUserById(member);
        members.push(res);
      }
      
      let project = await getProjectById(task.projectId);

      for (const member of members) {
        console.log("member.mail: ", member.email);
        if (member.email) {
          let to = member.email;
          let subject = "Tarea de Guru Project actualizada.";
          let text = `Proyecto: ${project.name}.\n Tarea: ${task.name}. \n Se ha actualizado el estado de la tarea. Estado actual: ${task.state}.\n `;
       
          await sendEmail(to, subject, text);
        }
      }

      console.log(`El observador ${this.nombre} ha enviado el correo.`);
      // Realizar acciones en respuesta al cambio del sujeto
    } catch (error) {
      console.error(error);
    }
  }
}

const emailSender = new Observer("Observador que envía emails");

export { Observer, emailSender };
