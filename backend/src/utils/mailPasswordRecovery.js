import nodemailer from "nodemailer"; //Enviar correo
import {config} from "../config.js";

//configurar el transporter
//¿Quien envia el correo?
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

//Quien lo envia
const sendEmail = async (to, subject, body, html) => {
    try {
        const info = await transporter.sendMail({
            from: "mrpardod871@gmail.com", // sender address
            to, // list of receivers
            subject, // Subject line
            body, // plain text body
            html, // html body
        });

        return info;

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        
    }
}

const HTMLRecoveryEmail = (code) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
            }
            .content {
                font-size: 16px;
                color: #555555;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #aaaaaa;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">Recuperación de Contraseña</div>
            <div class="content">
                Hola,<br><br>
                Hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código para completar el proceso de recuperación:
                <br><br>
                <strong style="font-size: 18px;">${code}</strong>
                <br><br>
                Si no solicitaste este cambio, puedes ignorar este correo.
            </div>
            <div style="text-align: center;">
                <a href="https://example.com/reset-password?code=${code}" class="button">Restablecer Contraseña</a>
            </div>
            <div class="footer">
                Si tienes algún problema, por favor contáctanos.<br>
                &copy; 2025 ZonaDigital. Todos los derechos reservados.
            </div>
        </div>
    </body>
    </html>
    `;
};

export {sendEmail, HTMLRecoveryEmail};