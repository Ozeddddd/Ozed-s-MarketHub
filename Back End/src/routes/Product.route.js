import express from "express";
import { getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/:id', getProduct)
router.post('/upload', createProduct )
router.patch('/update/:id', updateProduct)
router.delete('/delete/:id', deleteProduct)

export default router;
