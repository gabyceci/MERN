//array de metodos (C R U D)
const clientsController = {};
import { json } from "express";
import clientsModel from "../models/Clients.js"; //llamamos el modelo

// SELECT
clientsController.getClients = async (req, res) => {
  const clients = await clientsModel.find();
  res.json(clients);
};

// INSERT
clientsController.createClients = async (req, res) => {
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;
  const newClient = new clientsModel({
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  });
  await newClient.save();
  res.json({ message: "client saved" });
};

// DELETE
clientsController.deleteClients = async (req, res) => {
  await clientsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "client deleted" });
};

// UPDATE
clientsController.updatedClients = async (req, res) => {
  //solicito todos los valores
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;

  await clientsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      lastName,
      birthday,
      email,
      password,
      telephone,
      dui,
      isVerified,
    },
    { new: true }
  );

  res, json({ message: "client updated" });
};

export default clientsController;
