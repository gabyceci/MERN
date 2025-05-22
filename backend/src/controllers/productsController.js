//array de metodos (C R U D)
const productsController = {};
import { json } from "express";
import productsModel from "../models/Products.js"; //llamamos el modelo

// SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

// INSERT
productsController.createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "product saved" });
};

// DELETE
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "product deleted" });
};

// UPDATE
productsController.updatedProducts = async (req, res) => {
  //solicito todos los valores
  const { name, description, price, stock } = req.body;

  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true }
  );

  res, json({ message: "product updated" });
};

export default productsController;
