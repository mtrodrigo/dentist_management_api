import express from "express";
import cors from "cors";
import UserRoutes from "./src/routes/UserRoutes.js"
import connectDB from "./src/db/conn.js";

const app = express();

const PORT = 3000;

connectDB();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);

app.listen(PORT, () => {
  console.log(`Servidor na porta: ${PORT}`);
});
