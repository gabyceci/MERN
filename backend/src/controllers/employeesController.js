//array de metodos (C R U D)
const employeesController = {};
import { json } from "express";
import employeesModel from "../models/Employees.js"; //llamamos el modelo

// SELECT
employeesController.getEmployees = async (req, res) => {
  const employees = await employeesModel.find();
  res.json(employees);
};

// INSERT
employeesController.createEmployees = async (req, res) => {
  const {
    name,
    lastName,
    birthday,
    email,
    address,
    hireDate,
    password,
    telephone,
    dui,
    isssNumber,
    isVerified,
  } = req.body;
  const newEmployees = new employeesModel({
    name,
    lastName,
    birthday,
    email,
    address,
    hireDate,
    password,
    telephone,
    dui,
    isssNumber,
    isVerified,
  });
  await newEmployees.save();
  res.json({ message: "Employees saved" });
};

// DELETE
employeesController.deleteEmployees = async (req, res) => {
  await employeesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Employees deleted" });
};

// UPDATE
employeesController.updatedEmployees = async (req, res) => {
  //solicito todos los valores
  const {
    name,
    lastName,
    birthday,
    email,
    address,
    hireDate,
    password,
    telephone,
    dui,
    isssNumber,
    isVerified,
  } = req.body;

  await employeesModel.findByIdAndUpdate(
    req.params.id,
    {
        name,
        lastName,
        birthday,
        email,
        address,
        hireDate,
        password,
        telephone,
        dui,
        isssNumber,
        isVerified,
    },
    { new: true }
  );

  res, json({ message: "Employees updated" });
};

export default employeesController;