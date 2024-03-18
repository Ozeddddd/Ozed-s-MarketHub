import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { sendEmail } from '../Services/emailservices.js'
import ejs from 'ejs';
import path,{fileURLToPath, URL} from 'url';
import {dirname} from 'path';


export const createUser = async (req, res) => {
try {
    const {email , username, firstName, lastName, password, userType} = req.body;
    const userExists = await userModel.findOne().or([{username}, {email}]);

    //CHECKING IF USER ALREADY EXISTS BEFORE ADDITION

    if (userExists){
        res.status(409).json({
            message: `User or Email already exists`,
            Status : `failed`,
            data: null
        })
    } 
const newUser = new userModel({
    firstName,
    lastName,
    username,
    email,
    password,
    userType,
})


//HASHING THE PASSWORD USING BCRYPT
const salt = await bcrypt.genSalt(10);
newUser.password = await bcrypt.hash(newUser.password, salt);


res.status(201).json({
    message: `User successfully created`,
    status: `Success`,
    data: newUser
})

const emailToken = jwt.sign(
    {
        userEmail: newUser.email,
        userId : newUser._id,
    },
    process.env.JWT_EMAIL_SECRET,
    {
        expiresIn : '10m'
    }
)
newUser.emailToken = emailToken;

const link = `${process.env.FRONTEND_URL}/verify-account/${process.env.EMAIL_TOKEN}`

//WE NOW RENDER THE EMAIL TEMPLATE USING EJS: 
//EJS takes in 2 arguments(path to the EJS file, data to be passed in)


const _filename = fileURLToPath(new URL(import.meta.url));
const _dirname = dirname(_filename);
const emailTemplatePath = path.resolve(_dirname, '../../src/Utils/emailTemplate/verifyUser.ejs')

const emailTemplate = ejs.renderFile(emailTemplatePath, {firstname:newUser.firstname, link});

//NOW TO CALL OUR EMAIL FUNCTION
const emailTitle = `Welcome to Ozed: The MarketHub`
try {
    await sendEmail(newUser.email, emailTitle, emailTemplate);
} catch (error) {
    console.error(`Error sending mail: ${error}`)
}


console.log(newUser);
// await newUser.save()

console.log(`reached line 82`)
console.log(res.status(201).json({
    message: `User successfully verified`,
    status: `Success`,
    date: newUser
}))


} catch (error) {
    res.status(500).json({
        message: error.message,
        status: `Fialed`,
    });
}
}