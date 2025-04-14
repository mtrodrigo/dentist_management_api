import jwt from "jsonwebtoken";
import getToken from "./getToken.js";

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "Acesso negado!" });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json("Token inválido!");
  }
  try {
    const verified = jwt.verify(token, "r2o7d0r4i8g5o");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json("Token inválido!");
  }
};

export default checkToken;
