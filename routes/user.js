const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

//Signup
router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", `Welcome ${username} to Wanderlust`);
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message); 
        res.redirect("/signup");      
    }
}));

//LogIn Routes

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login", passport.authenticate('local',{
    failureRedirect : '/login', failureFlash:true}),
    (req,res)=>{
        console.log("login ");
        res.send("welcome you are logged in ");
});

module.exports = router;