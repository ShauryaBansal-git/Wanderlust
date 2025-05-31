const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Major_project/models/listing");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

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

//index route
app.get("/listings", wrapAsync(async (req,res,next)=>{
    let allData = await Listing.find({});
    res.render("./listings/index.ejs",{allData});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/show.ejs",{data});
}));

//create route
app.post("/listings",wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing data");
    }
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/edit.ejs",{data});
}));

//update route
app.put("/listings/:id",wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing data");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

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