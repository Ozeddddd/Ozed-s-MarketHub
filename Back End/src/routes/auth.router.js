import express from 'express';
import { createUser, verifyUser, loginUser } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', createUser);
router.get('/verify-account/:params', verifyUser);
router.post('/login', loginUser)

export default router;