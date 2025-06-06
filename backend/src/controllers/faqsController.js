import faqsModel from "../models/faqs.js";

import {json} from "express";

//Creo un array de funciones vacias
const faqsController = {};

//SELECT
faqsController.getAllFaqs = async (req, res) => {
   try {
    const faqs = await faqsModel.find()
    res.status(200).json(faqs)
   } catch (error) {
    console.log("error" + error)
    res.status(500).json("Internal server error")
   }
}

//INSERT
faqsController.insertFaqs = async (req, res) => {
    //1- Pedir los datos
    const {question, answer, level, isActive} = req.body;
    try {
        //Validaciones

        //Si hay campos vacios
        if(!question || !answer || !level || !isActive){
            return res.status(400).json({message: "Please write all the fields"})
        }

        if(level < 1 || level > 10){
            return res.status(400).json({message: "Enter a number between 1 to 10"})
        }

         if(question.legth < 4 || answer.legth < 4){
            return res.status(400).json({message: "To short"})
        }

        //Guardamos todo a la base de datos
        const newFaqs = new faqsModel({
            question, 
            answer, 
            level, 
            isActive,
        });

        newFaqs.save();

        res.status(200).json({message: "Faq saved"})
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
};


//UPDATE
faqsController.updateFaqs = async (req, res) => {

    //1- Pido las cosas
    const {question, answer, level, isActive} = req.body;
    try {
        //Validaciones

        if(level < 1 || level > 10){
            return res.status(400).json({message: "Enter a number between 1 to 10"})
        }

         if(question.legth < 4 || answer.legth < 4){
            return res.status(400).json({message: "To short"})
        }

        //Guardamos todo a la base de datos
        const faqsUpdated = new faqsModel.findByIdAndUpdate(
            req.params.id,
            {question, answer, level, isActive},
            {new: true}
        )

        if(!faqsUpdated){
            res.status(400).json({message: "Faqs not found"})
        }

        res.status(200).json({message: "Faqs update"})

    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
}


//DELETE
faqsController.deleteFaqs = async (req, res) => {
    try {
        const deleteFaqs = await faqsModel.findByIdAndDelete(req.params.id);

        if(!deleteFaqs){
            return res.status(400).json({message: "faq not found"});
        }
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
};

export default faqsController;