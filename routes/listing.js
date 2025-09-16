const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(404,msg);
    }else{
        next();
    }
}

//index route
router.get("/", wrapAsync(async (req,res,next)=>{
    let allData = await Listing.find({});
    res.render("./listings/index.ejs",{allData});
}));

//new route
router.get("/new", isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate("reviews");
    if(!data){
        req.flash("error","The listing you requested for, does not exists!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{data});
}));

//create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error","The listing you requested for, does not exists!");
        return res.redirect("/listings");
    }
    req.flash("success","Listing edited");
    res.render("./listings/edit.ejs",{data});
}));

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Lisitng updated !!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;