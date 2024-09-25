// const nodemailer = require("nodemailer");

// // Configurar el transporte SMTP
// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "basedatosAP@outlook.com",
//     pass: "basedatos2022!*",
//   },
// });

// const sendEmail = (to, subject, text) => {
//   // Definir el contenido del correo
//   const mailOptions = {  from: "basedatosAP@outlook.com", to, subject, text};

//   // Enviar el correo
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("Error al enviar el correo:", error);
//     } else {
//       console.log("Correo enviado:", info.response);
//     }
//   });
// };

// export { sendEmail };
