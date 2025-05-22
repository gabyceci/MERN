import express from "express";
import logoutController from "../controllers/logoutController.js";

// Router() nos ayuda a colocar los metodos que tendra mi ruta
const router = express.Router();

router.route("/").post(logoutController.logout);

export default router;