import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";
import Patient from "../models/Patient.js";

export default class PatientsController {
  static async create(req, res) {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Campo obrigatório não preenchido" });
    }

    //destructure the request body
    const {
      name,
      email,
      phone,
      cpf,
      birthDate,
      address,
      city,
      state,
      zipCode,
      medicalHistory,
    } = req.body;

    //validation
    if (
      !name ||
      !email ||
      !phone ||
      !cpf ||
      !birthDate ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !medicalHistory
    ) {
      return res
        .status(400)
        .json({ message: "Campo obrigatório não preenchido" });
    }

    //check if the user is authenticated
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    //create a patient
    const patient = new Patient({
      name,
      email,
      phone,
      cpf,
      birthDate,
      address,
      city,
      state,
      zipCode,
      medicalHistory,
      user: {_id: user._id},
    });
    try {
      const newPatient = await patient.save();
      return res.status(201).json({
        message: "Paciente cadastrado com sucesso",
        newPatient,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar paciente" });
    }
  }

  static async getAllUserPatients(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    const patients = await Patient.find({"user._id": user._id}).sort("-createdAt")
    res.status(200).json({ patients })
  }

  static async getPatientById(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)
    const patient = await Patient.findOne({ _id: id, "user._id": user._id })
    if (!patient) {
      return res.status(404).json({ message: "Paciente não encontrado" });
    }
    res.status(200).json({ patient })
  }
}
