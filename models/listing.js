const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
    },
    description : String,
    image : {
        type : String,
        default : "https://plus.unsplash.com/premium_photo-1683880731792-39c07ceea617?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v)=> v === "" ? 
        "https://plus.unsplash.com/premium_photo-1683880731792-39c07ceea617?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
         v,
    },
    price : {
        type : Number,
    },
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;