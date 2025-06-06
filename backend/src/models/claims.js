/*
    Campos: 
        customerld: Objectid, 
        productid: Objectid, 
        branchld: Objectid, 
        employeeld: Objectid, 
        subject: string, 
        description: string, 
        status: String 
        createdAt: Date, 
        updatedAt: Date, 
        response: string, 
        level: Number
 */

import {Schema, model} from "mongoose";

const faqsSchema = new Schema(
    {
        customerld:{
            type: Objectid,
            
        },
        productid:{
            type: Objectid,
           
        },
        branchld:{
            type:Objectid,
            
        },
        employeeld:{
            type: Objectid,
         
        },
        subject:{
            type: String,
          
        },
        description:{
            type: String,
            
        },
        status:{
            type: String,
           
        },
        createdAt:{
            type: Date,
            
        },
        updatedAt:{
            type: Date,
         
        },
        response:{
            type: String,
           
        },
         level:{
            type: Number,
            
        }
    }, 
    {
        timestamps: true,
        strict: false,
    }
);   

export default model("faqs", faqsSchema);