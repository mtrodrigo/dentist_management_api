import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/UserRoutes.js"
import connectDB from "./src/db/conn.js";
import PatientsRoutes from "./src/routes/PatientsRouter.js"

const app = express();

const PORT = 3000;

connectDB();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/patients", PatientsRoutes);

app.use((req, res, next) => {
  console.log(`Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).send("Rota não encontrada");
});

app.listen(PORT, () => {
  console.log(`Servidor na porta: ${PORT}`);
});
