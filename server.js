const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db")
const cors = require("cors")
const {errorHandler} = require("./middleware/errorMiddleware")

const port = process.env.port || 3000;

connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(cors())
app.get("/",function(req,res,next){})

//importing routes
const authRoute = require("./routes/auth")

//error handling
app.use(errorHandler);

//setting the routes
app.use("/auth",authRoute)
app.listen(port, ()=>{
    console.log(`sever started on port ${port}`)
})