import express from "express";
import registerClientController from "../controllers/registerClientsController.js";

// Router() nos ayuda a colocar los metodos que tendra mi ruta
const router = express.Router();

router.route("/").post(registerClientController.registerClient);
router.route("/verifyCodeEmail").post(registerClientController.verificationCodeEmail);

export default router;