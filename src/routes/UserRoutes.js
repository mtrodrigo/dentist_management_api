import express from 'express';
import UserController from '../controller/UserController.js';


const router = express.Router();

router.post('/register', UserController.register);
router.get('/getall', UserController.getAllUsers);
router.get('/login', UserController.login)

export default router;

