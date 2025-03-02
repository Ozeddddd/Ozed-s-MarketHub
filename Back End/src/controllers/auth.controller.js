import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Services/emailservices.js";
import ejs from "ejs";


export const createUser = async (req, res) => {
    try {
        const { email, username, firstName, lastName, password, userType, emailToken } =
        req.body;

        const userExists = await userModel.findOne().or([
            { username },
            { email },
        ]);

        //CHECKING IF USER ALREADY EXISTS BEFORE ADDITION

        if (userExists) {
            return res.status(409).json({
                message: `User or Email already exists`,
                Status: `failed`,
                data: null,
            });
        }

        const newUser = new userModel({
            firstName,
            lastName,
            username,
            email,
            password,
            userType,
            emailToken,
        });

        //HASHING THE PASSWORD USING BCRYPT
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);

        //GENERATING A TOKEN FOR THE EMAIL VERIFICATION
        //JWT.SIGN TAKES IN 3 ARGUMENTS: PAYLOAD, SECRET, OPTIONS.  WHERE PAYLOAD IS THE DATA TO BE ENCODED AND SECRET IS THE SECRET KEY TO BE USED FOR THE ENCODING. OPTIONS IS AN OBJECT THAT CONTAINS THE EXPIRATION DATE OF THE
        //TOKE
        const encodedMailToken = jwt.sign(
            {
                userEmail: newUser.email,
                userId: newUser._id,
            },
            process.env.JWT_EMAIL_SECRET,
            {
                expiresIn: "1hr",
            }
        ); 

        newUser.emailToken = encodedMailToken;

        const link = `${process.env.BASE_URL}/auth/verify-account/${encodedMailToken}`;

        //WE NOW RENDER THE EMAIL TEMPLATE USING EJS:
        //EJS takes in 2 arguments(path to the EJS file, data to be passed in)

        
    try {
        const emailTemplate = await ejs.renderFile("src/controllers/verifyUser.ejs", 
            {
                firstName: newUser.firstName,
                link,
            });

        //NOW TO CALL OUR EMAIL FUNCTION
        const emailTitle = `Welcome to Ozed: The MarketHub`;

        await sendEmail(newUser.email, emailTitle, emailTemplate);
        
    } catch (error) {
            console.error(`Error sending mail: ${error}`);
        }

    await newUser.save();

            return res.status(201).json({
                message: `User successfully created`,
                status: `Success`,
                data: newUser,
            });

        }   catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: `An error occurred while creating user. Please try again`,
                    status: `Failed`,
                    });
            }
};


export const verifyUser = async (req, res) => {

        
    try {
        const {params} = req.params;

        const decodedToken =  jwt.verify(params, process.env.JWT_EMAIL_SECRET);

        const {userId} = decodedToken

        const user = await userModel.findById(userId)
        // console.log(decodedToken)
        
        if(!user){
            return res.status(404).json({
                message: `User not found`,
                status: `failed`,
                data: null
            })
        }

        
        if (user.isVerified){
            return res.status(400).json({
                message: `User is verified. Kindly login to access your account`,
                status: `failed`,
                data: null
            })
        }


        if(user.emailToken !== params){
            return res.status(400).json({
                message: `Invalid Token`,
                status: `failed`,
            })
        }
        
        
        user.isVerified = true;
        user.emailToken = null;
        
        await user.save()

        return res.status(201).json({
            message: `Your account has been verified successfully`,
            status: `Success`,
        })
        
    } catch (error) {
        console.log(error)
                return res.status(500).json({
                    message: `An error occurred while verifying user. Please try again`,
                    status: `Failed`,
                    data: error.message
                    });
    }
}


export async function loginUser(req, res){
    try {
      //Check if the email exist
      const user = await userModel.findOne({
        $or: [{ email: req.body.email }, { userName: req.body.userName }],
      });
      
      
      //If user doesnt exist, return an error response back
      if (!user) {
        return res.status(404).json({
          message: "Wrong email combination", 
          status: "failed",
          data: null,
        });
      }
     //Check if the user has verified their account
      if (!user.isVerified) {
        return res.status(400).json({
          message: "Please verify your account to login",
          status: "failed",
          data: null,
        });
      }
  
      //Check if the password is correct

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      console.log(validPassword);
      console.log(req.body.password);
      console.log(user.password);
    
      if (!validPassword) {
        return res.status(400).json({
          message: "Wrong password combination",
          status: "failed",
          data: null,
        }); 
      }
  
      const token = await user.generateAuthToken();
      
      return res.status(200).json({
        message: "You have succesfull logged in",
        status: "success",
        token,
        data: {
            id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
        }
      });
  
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `Unable to login user. Please try again.`,
        error: err.message,
        status: "failed",
        data: null,
      });
      }
    
  }