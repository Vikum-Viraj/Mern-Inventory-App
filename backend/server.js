const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const userRoute = require("./routes/userRoute")
const errorHandler =  require("./middleWare/errorMiddleware")
const cors = require("cors")
const cookieParse = require("cookie-parser")

const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cookieParse());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Routes middleware
app.use("/api/users",userRoute);


//Routes
app.get("/",(req,res) => {
    res.send("Hello world");
})

//error handler
app.use(errorHandler)


//connect mongodb
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL).then(() => {

            app.listen(PORT,() => {
                console.log(`Server runing on port ${PORT}`)
            })
        })
        .catch((err) => {
            console.log(err)
        })