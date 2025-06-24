import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/UserRoutes.js";
import connectDB from "./src/db/conn.js";
import PatientsRoutes from "./src/routes/PatientsRouter.js";

connectDB();

const app = express();

app.use(cors({
  origin: ['https://dentist-management-nine.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/patients", PatientsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
