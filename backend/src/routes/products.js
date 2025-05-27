import express from "express";
import productsController from "../controllers/productsController.js";
// Router() nos ayuda a colocar los metodos que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(productsController.getProducts)
  .post(productsController.createProducts);

router
  .route("/:id")
  .put(productsController.updatedProducts)
  .delete(productsController.deleteProducts)
  .put(productsController.updatebyId)
  .get(productsController.getProductById);

  export default router;