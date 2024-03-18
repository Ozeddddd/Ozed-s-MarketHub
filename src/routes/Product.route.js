import express from "express";
import { getProduct, createProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/product', getProduct)
router.post('/createproduct', createProduct )

export default router;
