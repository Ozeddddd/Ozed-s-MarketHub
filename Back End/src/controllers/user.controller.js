import userModel from "../models/user.model.js";

export const getUser = async (req, res)=>{
    try {
        const {id} = req.params
        
        const user = await userModel.findById(id);

    if (!user){
        return res.status(404).json({
            message: `user not found`,
            status: `failed`,
            data: null
        })
    }
    return res.status(200).json({
        message: "User successfully found",
        status: "success",
        data: user,
    })
    } 
    catch (error) {
        console.log(error);
    return res.status(500).json({
        message: "An error occured while fetching user",
        status: "failed",
        data: null,
    });
    }
}