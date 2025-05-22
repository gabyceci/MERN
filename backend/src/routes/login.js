import express from "express";
import loginController from "../controllers/loginController.js";
// Router() nos ayuda a colocar los metodos que tendra mi ruta
const router = express.Router();

router.route("/").post(loginController.login);

export default router;