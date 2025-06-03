import express from "express";
import PatientsController from "../controller/PatientsController.js";
import checkToken from "../helpers/verifyToken.js";
import multer, { memoryStorage } from "multer";

const router = express.Router();

const upload = multer({ storage: memoryStorage() })

router.post("/create", checkToken, upload.array("images"), PatientsController.create);
router.get("/mypatients", checkToken, PatientsController.getAllUserPatients);
router.get("/mypatients/:id", checkToken, PatientsController.getPatientById);
router.patch("/mypatients/:id", checkToken, PatientsController.updatePatient);
router.delete(
  "/mypatients/:id",
  checkToken,
  PatientsController.removePatientById
);

export default router;
