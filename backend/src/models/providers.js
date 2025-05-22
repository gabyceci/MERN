/*
    Colección: Providers
    Campos:
        name
        telephone
        image
*/

import {Schema, model} from "mongoose";

const providerSchema = new Schema(
    {
        name: {
            type: String
        },
        telephone: {
            type: String
        },
        image: {
            type: String
        }
    },{
            timestamps: true,
            strict: false
        }
)
export default model("providers", providerSchema)