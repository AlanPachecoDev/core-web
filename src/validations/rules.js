

function validateEmail(email) {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Comprueba si el email coincide con el formato de correo electrónico válido
    if (emailRegex.test(email)) {
        // El email es válido, retorna true
        return true;
    } else {
        // El email es inválido, retorna un string con el mensaje de error
        return 'The email is not valid.';
    }
}

function validateProjectName(name) {
    // Comprueba si el nombre no está vacío
    if (!name) {
        // El nombre está vacío, retorna un string con el mensaje de error
        return "The project name can't be empty.";
    }

    if (name.length < 5) {
        return "The project name lenght needs to be at least 5 characters."
    }

    if (name.length > 50) {
        return "The project name lenght can't have more than 50 characters."
    }

    // El nombre cumple con todas las condiciones, retorna true
    return true;
}

function validateTeamName(name) {
    // Comprueba si el nombre no está vacío
    if (!name) {
        // El nombre está vacío, retorna un string con el mensaje de error
        return "The team name can't be empty.";
    }

    // Comprueba si el nombre contiene solo letras y espacios
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        // El nombre contiene caracteres no permitidos, retorna un string con el mensaje de error
        return 'The team name can have only letters and spaces.';
    }

    if (name.length < 5) {
        return "The team name lenght needs to be at least 5 characters."
    }

    if (name.length > 50) {
        return "The team name lenght can't have more than 50 characters."
    }


    // El nombre cumple con todas las condiciones, retorna true
    return true;
}

function validateName(name) {
    // Comprueba si el nombre no está vacío
    if (!name) {
        // El nombre está vacío, retorna un string con el mensaje de error
        return "The name can't be empty.";
    }

    // Comprueba si el nombre contiene solo letras y espacios
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        // El nombre contiene caracteres no permitidos, retorna un string con el mensaje de error
        return "The name can have only letters and spaces.";
    }

    if (name.length < 2) {
        return "The name lenght needs to be at least 2 characters."
    }

    if (name.length > 50) {
        return "The name lenght can't have more than 50 characters."
    }

    // El nombre cumple con todas las condiciones, retorna true
    return true;
}

function validateDescription(description) {
    // Comprueba si el nombre no está vacío
    if (!description) {
        // El nombre está vacío, retorna un string con el mensaje de error
        return "The description can't be empty.";
    }


    if (description.length < 10) {
        return "The description lenght needs to be at least 10 characters."
    }

    if (description.length > 500) {
        return "The description lenght can't have more than 500 characters."
    }

    // El nombre cumple con todas las condiciones, retorna true
    return true;
}


function validateSurname(surname) {
    // Comprueba si el apellido no está vacío
    if (!surname) {
        // El apellido está vacío, retorna un string con el mensaje de error
        return "The surname can't be empty.";
    }

    // Comprueba si el apellido contiene solo letras y espacios
    const surnameRegex = /^[A-Za-z\s]+$/;
    if (!surnameRegex.test(surname)) {
        // El apellido contiene caracteres no permitidos, retorna un string con el mensaje de error
        return "The surname can have only letters and spaces.";
    }

    if (surname.length < 2) {
        return "The surname lenght needs to be at least 2 characters."
    }
    // El apellido cumple con todas las condiciones, retorna true
    return true;
}

function validateCity(city) {
    // Comprueba si la ciudad no está vacía
    if (!city) {
        // La ciudad está vacía, retorna un string con el mensaje de error
        return "The city can't be empty.";
    }

    // Comprueba si la ciudad contiene solo letras y espacios
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!cityRegex.test(city)) {
        // La ciudad contiene caracteres no permitidos, retorna un string con el mensaje de error
        return "The city can have only letters and spaces." ;
    }

    // La ciudad cumple con todas las condiciones, retorna true
    return true;
}


function validatePassword(password) {
    // Comprueba si la contraseña no está vacía
    if (!password) {
        // La contraseña está vacía, retorna un string con el mensaje de error
        return "The password can't be empty.";
    }

    // Comprueba si la contraseña tiene al menos 6 caracteres y máximo 30
    if (password.length < 6 || password.length > 30) {
        // La contraseña no cumple con el rango de caracteres, retorna un string con el mensaje de error
        return "The password lenght needs to be at least 6 characters and maximum 30.";
    }

    // Comprueba si la contraseña contiene al menos 1 número
    const numberRegex = /\d/;
    if (!numberRegex.test(password)) {
        // La contraseña no contiene al menos 1 número, retorna un string con el mensaje de error
        return 'The password needs to have at least 1 number.';
    }

    // La contraseña cumple con todas las condiciones, retorna true
    return true;
}

function validateBirthdate(fechaDeNacimiento) {
    console.log("fechaDeNacimiento: ", fechaDeNacimiento);
    // Comprueba si la fecha de nacimiento no está vacía
    if (!fechaDeNacimiento) {
        // La fecha de nacimiento está vacía, retorna un string con el mensaje de error
        return "The birthdate can't be empty";
    }

    // Convierte la fecha de nacimiento en un objeto de tipo Date
    const birthdate = new Date(fechaDeNacimiento);

    // Calcula la diferencia en milisegundos entre la fecha de nacimiento y la fecha actual
    const currentDate = new Date();
    const ageDifference = currentDate - birthdate;

    // Calcula la edad en años
    const ageInYears = Math.floor(ageDifference / (1000 * 60 * 60 * 24 * 365));

    // Comprueba si la edad es menor a 12 años
    if (ageInYears < 12) {
        // La edad es menor a 12 años, retorna un string con el mensaje de error
        return 'The minumum age to register is 12 years.';
    }

    // La fecha de nacimiento cumple con todas las condiciones, retorna true
    return true;
}

function validateEndDate(endDate) {
    console.log("EndDate: ", endDate);
    // Comprueba si la fecha de nacimiento no está vacía
    if (!endDate) {
        // La fecha de nacimiento está vacía, retorna un string con el mensaje de error
        return "The estimated end date can't be empty";
    }

    const fechaActual = new Date();
    var parts = endDate.split("/");
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    endDate =  new Date(parts[2], parts[1] - 1, parts[0]); // month is 0-based

    // Comprobar si la fecha está en el pasado
    const esFechaPasada = endDate.getTime() < fechaActual.getTime();
    
    if (esFechaPasada) {
        return "The estimated end date can't be empty. Set at least one week.";
    }

    // Comprobar si ha pasado una semana desde la fecha actual
    const unaSemanaEnMs = 7 * 24 * 60 * 60 * 1000; // Una semana en milisegundos
    const fechaEnUnaSemana = new Date(fechaActual.getTime() + unaSemanaEnMs);
    const cumpleMinimoSemana = endDate.getTime() > fechaEnUnaSemana.getTime();

    if (!cumpleMinimoSemana) {
        return "Please set at least one week to complete the activities."
    }

    // La fecha de nacimiento cumple con todas las condiciones, retorna true
    return true;
}





export { validateEmail, validateName, validateSurname, validateCity, validatePassword, validateBirthdate, validateProjectName, validateTeamName, validateDescription, validateEndDate }