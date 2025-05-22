import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import {config} from "../config.js"

import clientsModel from "../models/Clients.js";
import employeesModel from "../models/Employees.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";

const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
    const { email } = req.body;


    try {
        let userFound;
        let usertType;

        userFound = await clientsModel.findOne({ email });

        if (userFound) {
            usertType = "client";
        } else {
            userFound = await employeesModel.findOne({ email });
            if (userFound) {
                usertType = "employee";
            }
        }

        if (!userFound) {
            return res.json({ message: "Usuario no encontrado" });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const token = jsonwebtoken.sign(
            { email, code, usertType, verified: false },
            config.JWT.secret,
            { expiresIn: "20m" });

        res.cookie("tokenRecoveryCode", token, {
            maxAge: 20 * 60 * 1000,
        });

        await sendEmail(
            email,
            "Código de recuperación de contraseña",
            `Tu código de recuperación es: ${code}`,
            HTMLRecoveryEmail(code)
        );

        res.json({ message: "email send" });

    } catch (error) {
        console.error("Error en la solicitud de código:", error);
        res.json({ message: "Error al solicitar el código de recuperación" });

    }
}

passwordRecoveryController.verifyCode = async (req, res) => {
    const { code } = req.body;

    try {
        const token = req.cookies.tokenRecoveryCode;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        console.log("Decoded token:", decoded);

        if (decoded.code !== code) {
            return res.json({ message: "Invalid code" });
        }

        const newToken = jsonwebtoken.sign(
            {
                email: decoded.email,
                code: decoded.code,
                usertType: decoded.usertType,
                verified: true
            },
            config.JWT.secret,
            { expiresIn: "20m" }
        );

        res.cookie("tokenRecoveryCode", newToken, {
            maxAge: 20 * 60 * 1000,
        });

        res.json({message: "Códe verified successfully"});

    } catch (error) {
        console.error("Error al verificar el código:", error);
        res.json({ message: "Error al verificar el código" });

    }
}

//Funcion para asignar una nueva contraseña
passwordRecoveryController.newPassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        //Extraer el token de las cookies
        const token = req.cookies.tokenRecoveryCode;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        if (!decoded.verified) {
            return res.json({ message: "Code not verified" });
        }

        const {email, usertType} = decoded;

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        let updateUser;

        if (usertType === "client") {
            updateUser = await clientsModel.findOneAndUpdate(
                { email},
                { password: hashedPassword},
                { new: true}
            );
        } else if (usertType === "employee") {
            updateUser = await employeesModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true}
            );
        }

        res.clearCookie("tokenRecoveryCode");
        res.json({ message: "Password updated" });

    } catch (error) {
        console.error("ERROR:", error);
        res.json({ message: "ERROR PASSWORD CANNOT BE UPDATE" });

    }
}

export default passwordRecoveryController;