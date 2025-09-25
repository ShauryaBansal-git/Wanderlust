const Listing = require("../models/listing.js");

module.exports.index = async (req,res,next)=>{
    let allData = await Listing.find({});
    res.render("./listings/index.ejs",{allData});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.show = async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path:"reviews",populate:"author"}).populate("owner");
    if(!data){
        req.flash("error","The listing you requested for, does not exists!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{data});
};

module.exports.create = async (req,res,next)=>{
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error","The listing you requested for, does not exists!");
        return res.redirect("/listings");
    }
    let originalUrl = data.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{data,originalUrl});
}

module.exports.update = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Lisitng updated !!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}