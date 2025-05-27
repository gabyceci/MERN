//array de metodos (C R U D)
const productsController = {};
import { json } from "express";
import productsModel from "../models/Products.js"; //llamamos el modelo

// SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

productsController.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productsModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
}
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
  const { name, description, price, stock } = req.body;

  try {
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
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
}



  productsController.updatebyId = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(
        id,
        { name, description, price, stock },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  }

  export default productsController;
