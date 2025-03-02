import productModel from "../models/product.model.js"

export const getProduct = async (req, res)=>{
    try {
        const {id} = req.params
        
        const product = await productModel.findById(id);

    if (!product){
        return res.status(404).json({
            message: `Product not found`,
            status: `failed`,
            data: null
        })
    }
    return res.status(200).json({
        message: "Product",
        status: "success",
        data: product,
    })
    } 
    catch (error) {
        console.log(error);
    return res.status(500).json({
        message: "An error occured while fetching product",
        status: "failed",
        data: null,
    });
    }
}
            

export const createProduct = async (req, res) =>{
    try {
        const product = await productModel.create(req.body);
        return res.status(200).json({
            message: `Product successfully uploaded`,
            status: `Success`,
            data: product
        });

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const updateProduct = async (req, res) => {
    try {
    const {id} = req.params; 
    const product = await productModel.findById(id);
    const {title,price, quantity, colour,specs} = req.body

    if (!product) {
        return res.status(404).json({
        message: "Product not found",
        status: "failed",
        data: null,
        });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
        _id,
        req.body,
        {
        new: true,
        useFindAndModify: false,
        }
    );

    return res.status(200).json({
        message: `Product has been updated`,
        status: "success",
        data: updateProduct,
    });

    } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "An error occured while fetching the data",
        status: "failed",
        data: null,
    });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await productModel.findById(id);
  
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
          status: "failed",
          data: null,
        });
      }
  
      await product.deleteOne({_id:id});
      res.json({
        message: "Product deleted successfully",
        status: "success",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "failed",
      });
    }
  };
  