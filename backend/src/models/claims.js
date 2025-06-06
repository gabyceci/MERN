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

        const claimsSchema = new Schema(
            {
                customerId:{
                    type: Schema.Types.ObjectId,
                    required: true
                },
                productId:{
                    type: Schema.Types.ObjectId
                },
                branchId:{
                    type: Schema.Types.ObjectId
                },
                employeeId:{
                    type: Schema.Types.ObjectId
                },
                subject:{
                    type: String,
                    required: true,
                    minLength: 5
                },
                description:{
                    type: String,
                    required: true,
                    minLength: 10
                },
                status:{
                    type: String
                },
                response:{
                    type: String,
                    minLength: 10
                },
                level:{
                    type: Number
                }
            }, 
            {
                timestamps: true,
                strict: false,
            }
        );   
        
        export default model("claims", claimsSchema);