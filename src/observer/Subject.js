// Clase Sujeto (Observable)
class Subject {
  constructor() {
    this.observadores = [];
  }

  // Método para registrar observadores
  registrarObservador(observador) {
    this.observadores.push(observador);
  }

  // Método para cancelar la suscripción de un observador
  cancelarSuscripcion(observador) {
    this.observadores = this.observadores.filter((obs) => obs !== observador);
  }

  // Método para notificar a los observadores cuando ocurre un cambio
  notificarCambio(task) {
    this.observadores.forEach((observador) => {
      observador.actualizar(task);
    });
  }
}

export default Subject;
