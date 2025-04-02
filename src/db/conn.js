import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
      throw new Error("DB_URL não definida no arquivo .env");
    }

    await mongoose.connect(DB_URL, {
      dbName: "dentistmanagement",
    });

    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1); 
  }
};

export default connectDB;