import mongoose from "mongoose";
import { Schema } from "mongoose";

const Patient = mongoose.model(
  "Patient",
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      cpf: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      birthDate: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      medicalHistory: {
        type: String,
        required: true,
        trim: true,
      },
      user: Object,
    },
    { timestamps: true }
  )
);

export default Patient;
