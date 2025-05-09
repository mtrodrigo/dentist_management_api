import express from 'express';
import PatientsController from '../controller/PatientsController.js';
import checkToken from '../helpers/verifyToken.js';


const router = express.Router();

router.post('/create', checkToken, PatientsController.create);
router.get('/mypatients', checkToken, PatientsController.getAllUserPatients)
router.get('/mypatients/:id', checkToken, PatientsController.getPatientById)
router.patch('/mypatients/:id', checkToken, PatientsController.updatePatient)
router.delete('/mypatients/:id', checkToken, PatientsController.removePatientById)

export default router;