 export const getAllProducts = async(req, res) => {
    try {
        res.status(200).json({
            data : 'All products here'
        })
    } catch (error) {
        res.status(500).json({
            message: `error occurred: ${error}`
        })
    }
   
}