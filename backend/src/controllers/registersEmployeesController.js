import employeeModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../config.js"

//creamos un array de funciones

const registerEmployeesController = {};

registerEmployeesController.register = async (req, res) => {
    //pedir todos los datos que vamos a guardar
    const { name,
        lastname,
        birthday,
        email,
        address,
        hireDate,
        password,
        telephone,
        dui,
        isssNumber,
        isVerified, } = req.body;

    try {
        //1- verificamos si el empleado ya existe
        const existEmployee = await employeeModel.findOne({ email })
        if (existEmployee) {
            return res.json({ message: "Employee already exist" })
        }

        //2- encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        //3- Guardar el usuario en la base de datos

        const newEmployee = new employeeModel({
            name,
            lastname,
            birthday,
            email,
            address,
            hireDate,
            password: passwordHash,
            telephone,
            dui,
            isssNumber,
            isVerified,
        })

        await newEmployee.save();
//token
jsonwebtoken.sign(
    //1- que voy a guardar
    {id: newEmployee._id},
    //2- secreto
    config.JWT.secret,
    //3- Cuando expira
    {expiresIn: config.JWT.expiresIn},
    //4- Funcion flecha
    (error, token) =>{
        if(error) console.log("error"+error)

            res.cookie("authToken", token)
            res.json({message: "Employees saved"})
    }
)

    } catch (error) {
console.log("error"+error)
res.json({message: "Error saving employee"})
    }
}

export default registerEmployeesController;