const express = require("express");
const router = express.Router({mergeParams : true});
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(404,msg);
    }else{
        next();
    }
}

router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review route

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;