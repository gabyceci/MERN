import express from "express";
import claimsController from "../controllers/claimsController.js";
//Router() nos ayuda a colocar los métodos que tendrá mi ruta
const router = express.Router();

router.route("/")
.get(claimsController.getAllClaims)
.post(claimsController.insertClaim)

router.route("/:id")
.put(claimsController.updateClaim)
.delete(claimsController.deleteClaim)

export default router;