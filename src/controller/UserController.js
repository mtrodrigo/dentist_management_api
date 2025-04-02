import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/createUserToken.js";

export default class UserController {
  static async register(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //validation
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatório" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação da senha é obrigatório" });
      return;
    }

    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ message: "A confirmação da senha e a senha são diferentes" });
      return;
    }

    //user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res
        .status(422)
        .json({ message: "E-mail inválido, utilize outro e-mail" });
      return;
    }

    //create user
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAllUsers(req, res) {
    const users = await User.find().sort("-createdAt");

    res.status(200).json({ users: users });
  }

  static async login(req, res) {
    
    const { email, password } = req.body;

    //validation
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatório" });
      return;
    }

    //check user
    const user = await User.findOne({ email: email})
    if(!user) {
        res.status(422).json({message: 'Usuário não encontrado'})
        return
    }

    //check password
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) {
        res.status(422).json({message: 'Senha incorreta'})
        return
    }

    await createUserToken(user, req, res)
  }
}
