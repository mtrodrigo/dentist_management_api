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
      user: { _id: user._id },
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
    const token = getToken(req);
    const user = await getUserByToken(token);

    const patients = await Patient.find({ "user._id": user._id }).sort(
      "-createdAt"
    );
    res.status(200).json({ patients });
  }

  static async getPatientById(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);
    const patient = await Patient.findOne({ _id: id, "user._id": user._id });
    if (!patient) {
      return res.status(404).json({ message: "Paciente não encontrado" });
    }
    res.status(200).json({ patient });
  }

  static async updatePatient(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Campo obrigatório não preenchido" });
    }

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
    const patient = await Patient.findOne({ _id: id, "user._id": user._id });
    if (!patient) {
      return res.status(404).json({ message: "Paciente não encontrado" });
    }

    //update the patient
    try {
      await Patient.updateOne(
        { _id: id },
        {
          $set: {
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
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Paciente atualizado com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar paciente" });
    }
  }

  static async removePatientById(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);
    const patient = await Patient.findOne({ _id: id, "user._id": user._id });
    if (!patient) {
      return res.status(404).json({ message: "Paciente não encontrado" });
    }
    if (patient.user._id.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Usuário não autorizado" });
    }
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Paciente removido com sucesso" });
  }
}
