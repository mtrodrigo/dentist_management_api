import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";
import Patient from "../models/Patient.js";
import FormData from "form-data";
import axios from "axios";

export default class PatientsController {
  static async create(req, res) {
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
      let imagesUrls = [];

      // Upload images
      if (req.files && req.files.length > 0) {
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

        // Await uploads
        imagesUrls = await Promise.all(uploadPromises);
      }

      // Create pacient
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
        images: imagesUrls,
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

    // Validation
    if (!name) return res.status(400).json({ message: "Nome é obrigatório" });
    if (!email) return res.status(400).json({ message: "Email é obrigatório" });
    if (!phone)
      return res.status(400).json({ message: "Telefone é obrigatório" });
    if (!cpf) return res.status(400).json({ message: "CPF é obrigatório" });
    if (!birthDate)
      return res
        .status(400)
        .json({ message: "Data de nascimento é obrigatória" });
    if (!address)
      return res.status(400).json({ message: "Endereço é obrigatório" });
    if (!city) return res.status(400).json({ message: "Cidade é obrigatória" });
    if (!state)
      return res.status(400).json({ message: "Estado é obrigatório" });
    if (!zipCode) return res.status(400).json({ message: "CEP é obrigatório" });
    if (!medicalHistory)
      return res
        .status(400)
        .json({ message: "Histórico médico é obrigatório" });

    try {
      const patient = await Patient.findOne({ _id: id, "user._id": user._id });
      if (!patient) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }

      let imagesUrls = patient.images;

      if (req.files && req.files.length > 0) {
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

        imagesUrls = await Promise.all(uploadPromises);
      }

      //Update patient
      const updatedPatient = await Patient.findByIdAndUpdate(
        id,
        {
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
          images: [ ...patient.images, ...imagesUrls],
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Paciente atualizado com sucesso",
        updatedPatient,
      });
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      return res.status(500).json({
        message: "Erro ao atualizar paciente",
        error: error.message
      });
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

  static async removeImage(req, res) {
    try {
      const imageUrl = decodeURIComponent(req.body.images);
      const id = req.params.id;
      const token = getToken(req);
      const user = await getUserByToken(token);

      console.log(id);
      console.log(imageUrl);      
      
      const patient = await Patient.findOne({
        _id: id,
        "user._id": user._id,
      });
      
      if (!patient) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }
      console.log("URLs in database:", patient.images);

      const updatedImages = patient.images.filter((img) => img !== imageUrl);

      if (updatedImages.length === patient.images.length) {
        return res
          .status(404)
          .json({ message: "Imagem não encontrada no paciente" });
      }

      const updatedPatient = await Patient.findByIdAndUpdate(
        id,
        { $set: { images: updatedImages } },
        { new: true }
      );

      return res.status(200).json({
        message: "Imagem removida com sucesso",
        updatedPatient,      });
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
