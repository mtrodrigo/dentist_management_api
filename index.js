import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/UserRoutes.js";
import connectDB from "./src/db/conn.js";
import PatientsRoutes from "./src/routes/PatientsRouter.js";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/patients", PatientsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

export default (req, res) => {
  app(req, res);
};
