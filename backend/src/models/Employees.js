/*
Campos:
name
latName
birthday
address
hireDate
password
telephone
dui
isssNumber
isVerified
*/

import { Schema, model } from "mongoose";

const employeesSchema = new Schema(
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
    address: {
      type: String,
      require: true,
    },
    hireDate: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    telephone: {
      type: String,
      require: true,
    },
    dui: {
      type: Number,
      require: true,
    },
    isssNumber: {
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

export default model("Employees", employeesSchema);