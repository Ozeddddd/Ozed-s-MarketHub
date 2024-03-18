import productModel from "../models/product.model.js"

export const getProduct = async (req, res)=>{
    try {
        await res.status(200).json(req.body)
        res.send(req.body)
    } catch (error) {
        res.send(`PRODUCT ERROR: ${error}`)
    }
}

export const createProduct = async (req, res) =>{
    try {
        const product = await product.create(productModel);
        return res.status(200).json(product);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}