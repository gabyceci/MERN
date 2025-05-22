//Array de metodos (C R U D)
const branchesController = {};
import {json} from "express";
import Branches from "../models/Branches.js";

//SELECT
branchesController.getBranches = async (req, res) => {
    const branches = await Branches.find()
    res.json(branches)
}

//INSERT
branchesController.createBranches = async (req, res) => {
    const {name, address, telephone, schedule} = req.body;
    const newBranch = new Branches({name, address, telephone, schedule});
    await newBranch.save()
    res.json({message: "Branches saved"});
}

//DELETE
branchesController.deleteBranches = async (req, res) => {
    await Branches.findOneAndDelete(req.params.id)
    res.json({message: "Branches delete"});
}

//UPDATE
branchesController.updateBranches = async (req, res) => {
    //Solicito todos los valores
    const {name, address, telephone, schedule} = req.body;
    //Actualizo
    await Branches.findByIdAndUpdate(req.params.id, {
        name, 
        address, 
        telephone, 
        schedule
    }, 
    {new: true}
);
    //Muestro un mensaje que todo se actualizo
    res.json({message: "Branches update"});
};

export default branchesController;