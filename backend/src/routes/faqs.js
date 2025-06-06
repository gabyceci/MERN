import express from "express";
import faqsController from "../controllers/faqsController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(faqsController.getAllFaqs)
.post(faqsController.insertFaqs)

router.route("/:id")
.put(faqsController.updateFaqs)
.delete(faqsController.deleteFaqs)

export default router;