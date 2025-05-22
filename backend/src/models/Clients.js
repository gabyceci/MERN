/*
campos:
name
latName
birthday
email
password
telephone
dui
isVerified
*/

import { Schema, model } from "mongoose";

const clientsSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    birthday: {
      type: Date,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    telephone: {
      type: Number,
      require: true,
    },
    dui: {
      type: Number,
      require: true,
    },
    isVerified: {
      type: Boolean,
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Clients", clientsSchema);
