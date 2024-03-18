import  express  from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import logger from "morgan";
import createError from "http-errors";
import { ConnectDB } from "./config/mongoose.js";
import productRouter from "./routes/Product.route.js";
import allProductsRouter from "./routes/allproducts.route.js";
import userModel from "./models/user.model.js";
import createUserRouter from "./routes/auth.router.js";
config();

const app = express();

ConnectDB()
    .then(
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server is running on ${process.env.PORT}`)
        })
    ).catch((error)=>{
        console.log(`Failed to connect: ${error}`)
    })

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(
    cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        preflightContinue: false,
    }))
// app.use(function (req, res, next) {
//     if (!req.user) return next(createError(401, 'Please login to view this page.'))
//     next()
// })
app.use('/', productRouter);
app.use('/', allProductsRouter);
app.use('/user', createUserRouter)

export default app   

