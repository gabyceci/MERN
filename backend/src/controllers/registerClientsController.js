//Importamos todas las librerias
import jsonwebtoken from "jsonwebtoken"; //Generar Token
import bcryptjs from "bcryptjs"; //Encriptar
import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto"; //Generar código

import clientsModel from "../models/Clients.js";
import { config } from "../config.js";

//Array de funciones
const registerClientsController = {};

registerClientsController.registerClient = async (req, res) => {
  // 1- Pedimos las cosas que vamos a guardar
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;

  try {
    //Verificar si el usuario ya existe
    const existClient = await clientsModel.findOne({ email });
    if (existClient) {
      return res.json({ message: "Client already exist" });
    }

    //Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    //Guardamos en la base de datos
    const newClient = new clientsModel({
      name,
      lastName,
      birthday,
      email,
      password: passwordHash,
      telephone,
      dui: dui || null,
      isVerified: isVerified || false,
    });
    await newClient.save();

    // Generar un código de verificación
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expireAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    // TOKEN
    jsonwebtoken.sign(
      //1- Que voy a guardar
      { email, verificationCode, expireAt },
      //2- secreto
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: config.JWT.expiresIn }
    );

    res.cookie("verificationToken", token, { maxAge: 2 * 60 * 60 * 1000 }); //Solo si esta validada con https se pone: {httpOnly: true}

    //Enviar correo de verificación
    //1- Transporter: ¿Desde dónde voy a enviar el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    //2- Options: ¿A quién se lo voy a enviar?
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: "Verificación de correo",
      text: `Para verificar que eres dueño de la cuenta, utiliza este codigo ${verificationCode}\n Este código expira en 2 horas\n`,
    };

    //3- Envio del correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("error" + error);
      res.json({ message: "Email sent" });
    });

    res.json({ message: "Client registered, please verify your email" });
  } catch (error) {
    res.json({ message: "Error" + error });
  }
};

registerClientsController.verificationCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  //Acceder al token "verification token" ya que este contiene: el email, el código de verificación y cuando expira el código
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.json({ message: "Please register your account first" });
  }

  try {
    //Verificamos y descoficamos el token para obtener el email y el cógido de verificación que acabamos de guardar al momento de registrar
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    //Comparar el código recibido con el almacenado en el token
    if (verificationCode !== storedCode) {
      return res.json({ message: "Invalid verification code" });
    }

    //Busco al cliente
    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.json({ message: "Client not found" });
    }

    //A ese cliente le cambio el campo "isVerified" a true
    (client.isVerified = true), await client.save();

    //Quitar el token con el email, codigo de verificación
    res.clearCookie("verificationToken");

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.json({ message: "Error" + error });
  }
};

export default registerClientsController;
