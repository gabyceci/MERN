const reviewsController = {};
import { json } from "express";
import Reviews from "../models/Reviews.js";
 
//SELECT
reviewsController.getReviews = async (req, res) => {
    const reviews = await Reviews.find().populate('idClient')
    res.json(reviews)
}
 
//INSERT
reviewsController.createReviews = async (req, res) => {
    const {comment, rating, idClient} = req.body;
    const newReviews = new Reviews({comment, rating, idClient});
    await newReviews.save()
    res.json({message: "Reviews saved"});
}
 
//DELETE
reviewsController.deleteReviews = async (req, res) => {
    await Reviews.findOneAndDelete(req.params.id)
    res.json({message: "Reviews delete"});
}
 
//UPDATE
reviewsController.updateReviews = async (req, res) => {
    //Solicito todos los valores
    const {comment, rating, idClient} = req.body;
    //Actualizo
    await Reviews.findByIdAndUpdate(req.params.id, {
        comment,
        rating,
        idClient
    },
    {new: true}
);
    //Muestro un mensaje que todo se actualizo
    res.json({message: "Reviews update"});
};
 
export default reviewsController;
