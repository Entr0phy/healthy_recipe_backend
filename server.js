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
app.use('/proxy',(req, res) => {
    const url = req.query.url;
    request({url: url}).pipe(res);
})

//importing routes
const authRoute = require("./routes/auth")
const recipeRoute = require("./routes/recipe")
const allergiesRoute = require('./routes/allergies');
//error handling
app.use(errorHandler);

//setting the routes
app.use("/auth",authRoute)
app.use("/recipe",recipeRoute)
app.use('/allergies',allergiesRoute)
app.listen(port, ()=>{
    console.log(`sever started on port ${port}`)
})