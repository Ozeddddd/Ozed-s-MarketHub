import express from 'express';
import { getAllProducts } from '../controllers/allproducts.controller.js';
const router = express.Router();

router.get('/allproducts', getAllProducts)

export default router;