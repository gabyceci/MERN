import express from "express";
import employeesController from "../controllers/employeesController.js";
// Router() nos ayuda a colocar los metodos que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(employeesController.getEmployees)
  .post(employeesController.createEmployees);

router
  .route("/:id")
  .put(employeesController.updatedEmployees)
  .delete(employeesController.deleteEmployees);

export default router;