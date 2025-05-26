const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Major_project/models/listing");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connection Successfull");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));
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
app.get("/listings", async (req,res)=>{
    let allData = await Listing.find({});
    res.render("./listings/index.ejs",{allData});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/show.ejs",{data});
});

//create route
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/edit.ejs",{data});
});

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen("8080",()=>{
    console.log("Listening on port 8080");
})