import claimsModel from "../models/claims.js";
import {json} from "express";
import mongoose from "mongoose";

const claimsController = {};

//SELECT
claimsController.getAllClaims = async (req, res) => {
   try {
    const claims = await claimsModel.find()
    res.status(200).json(claims)
   } catch (error) {
    console.log("error" + error)
    res.status(500).json("Internal server error")
   }
}

//INSERT
claimsController.insertClaim = async (req, res) => {
    const {customerId, productId, branchId, employeeId, subject, description, status, response, level} = req.body;
    
    try {

        if(!customerId){
            return res.status(400).json({message: "CustomerId is required"})
        }
        if(!mongoose.Types.ObjectId.isValid(customerId)){
            return res.status(400).json({message: "CustomerId must be a valid ObjectId"})
        }

        if(productId && !mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({message: "ProductId must be a valid ObjectId"})
        }
        if(branchId && !mongoose.Types.ObjectId.isValid(branchId)){
            return res.status(400).json({message: "BranchId must be a valid ObjectId"})
        }
        if(employeeId && !mongoose.Types.ObjectId.isValid(employeeId)){
            return res.status(400).json({message: "EmployeeId must be a valid ObjectId"})
        }

        if(!subject){
            return res.status(400).json({message: "Subject is required"})
        }
        if(subject.length < 5){
            return res.status(400).json({message: "Subject must have at least 5 characters"})
        }

        if(!description){
            return res.status(400).json({message: "Description is required"})
        }
        if(description.length < 10){
            return res.status(400).json({message: "Description must have at least 10 characters"})
        }

        if(response && response.length < 10){
            return res.status(400).json({message: "Response must have at least 10 characters"})
        }

        const newClaim = new claimsModel({
            customerId,
            productId,
            branchId,
            employeeId,
            subject,
            description,
            status,
            response,
            level
        });

        await newClaim.save();

        res.status(200).json({message: "Claim saved"})
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
claimsController.updateClaim = async (req, res) => {
    const {customerId, productId, branchId, employeeId, subject, description, status, response, level} = req.body;
    
    try {
        
        if(customerId && !mongoose.Types.ObjectId.isValid(customerId)){
            return res.status(400).json({message: "CustomerId must be a valid ObjectId"})
        }
        if(productId && !mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({message: "ProductId must be a valid ObjectId"})
        }
        if(branchId && !mongoose.Types.ObjectId.isValid(branchId)){
            return res.status(400).json({message: "BranchId must be a valid ObjectId"})
        }
        if(employeeId && !mongoose.Types.ObjectId.isValid(employeeId)){
            return res.status(400).json({message: "EmployeeId must be a valid ObjectId"})
        }
        
        if(subject && subject.length < 5){
            return res.status(400).json({message: "Subject must have at least 5 characters"})
        }

        if(description && description.length < 10){
            return res.status(400).json({message: "Description must have at least 10 characters"})
        }

        if(response && response.length < 10){
            return res.status(400).json({message: "Response must have at least 10 characters"})
        }

        const claimUpdated = await claimsModel.findByIdAndUpdate(
            req.params.id,
            {customerId, productId, branchId, employeeId, subject, description, status, response, level},
            {new: true}
        );

        if(!claimUpdated){
            return res.status(400).json({message: "Claim not found"})
        }

        res.status(200).json({message: "Claim updated"})

    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
}

//DELETE
claimsController.deleteClaim = async (req, res) => {
    try {
        const deleteClaim = await claimsModel.findByIdAndDelete(req.params.id);

        if(!deleteClaim){
            return res.status(400).json({message: "Claim not found"});
        }

        res.status(200).json({message: "Claim deleted"});
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
};

export default claimsController;