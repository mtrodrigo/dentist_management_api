import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  const decoded = jwt.verify(token, "r2o7d0r4i8g5o");

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

export default getUserByToken;
