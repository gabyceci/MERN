//express es un servidor que me dara una red

//importo todo lo de la libreria de express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import clientsRoutes from "./src/routes/clients.js";
import branchesRoutes from "./src/routes/branches.js"
import reviewsRoutes from "./src/routes/reviews.js";
import employeesRoutes from "./src/routes/employees.js"
import registerEmployeesRoutes from "./src/routes/registerEmployees.js"
import cookieParser from "cookie-parser";
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import registerClientRoutes from "./src/routes/registerClients.js"
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js"
import providersRoutes from "./src/routes/providers.js";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
import cors from "cors";

//crear constante que es igual a la libreria que importe
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173",
      // Permitir envío de cookies y credenciales
      credentials: true
    })
  );

//Que acepte datos de json
app.use(express.json());
//Que postman acepte guardar cookies
app.use(cookieParser())

//Definir las rutas de las funciones que tendra la pagina web
app.use("/api/products", productsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/employees", employeesRoutes);

app.use("/api/registerEmployees", registerEmployeesRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/registerClients", registerClientRoutes)

app.use("/api/recoveryPassword", recoveryPasswordRoutes)

app.use("/api/providers", providersRoutes)

//exporto la constante para poder usar express en otros archivos
export default app;
