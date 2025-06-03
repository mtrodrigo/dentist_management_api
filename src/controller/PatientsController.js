import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";
import Patient from "../models/Patient.js";
import FormData from "form-data";
import axios from "axios";

export default class PatientsController {
  static async create(req, res) {
    console.log("[DEBUG] req.body:", req.body); // Verifique se os campos estão chegando
    console.log("[DEBUG] req.files:", req.files); // Verifique as imagens (se enviadas)

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Dados não enviados" });
    }
    //check if the user is authenticated
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
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
    if (!name) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Telefone é obrigatório" });
    }
    if (!cpf) {
      return res.status(400).json({ message: "CPF é obrigatório" });
    }
    if (!birthDate) {
      return res
        .status(400)
        .json({ message: "Data de nascimento é obrigatória" });
    }
    if (!address) {
      return res.status(400).json({ message: "Endereço é obrigatório" });
    }
    if (!city) {
      return res.status(400).json({ message: "Cidade é obrigatória" });
    }
    if (!state) {
      return res.status(400).json({ message: "Estado é obrigatório" });
    }
    if (!zipCode) {
      return res.status(400).json({ message: "CEP é obrigatório" });
    }
    if (!medicalHistory) {
      return res
        .status(400)
        .json({ message: "Histórico médico é obrigatório" });
    }
    try {
      let imagesUrls = []; // Array para armazenar URLs de todas as imagens

      // Processar TODAS as imagens se existirem
      if (req.files && req.files.length > 0) {
        // Processar cada imagem em paralelo
        const uploadPromises = req.files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });

          const imgBbResponse = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMG_BB_KEY}`,
            formData,
            { headers: formData.getHeaders() }
          );
          return imgBbResponse.data.data.url;
        });

        // Aguardar todos os uploads terminarem
        imagesUrls = await Promise.all(uploadPromises);
      }

      // Criar paciente com todas as URLs
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
        images: imagesUrls, // Todas as URLs serão salvas
      });

      const newPatient = await patient.save();
      res.status(201).json({
        message: "Paciente cadastrado com sucesso",
        newPatient,
      });
    } catch (error) {
      console.error("Erro no upload de imagens:", error);
      res.status(500).json({
        message: "Erro ao processar imagens",
        error: error.message,
      });
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
