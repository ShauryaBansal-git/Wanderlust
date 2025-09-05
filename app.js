const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connection Successfull");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect(Mongo_URL);
}

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use("/",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let{status=500,message="Some error occured"} = err;
    res.status(status).render("listings/error",{message});
});

app.listen("8080",()=>{
    console.log("Listening on port 8080");
});