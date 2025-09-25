const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

//Signup
router.route("/signup")
    .get(userController.renderSignUp)
    .post(wrapAsync(userController.SignUp));

//LogIn Routes

router.route("/login")
    .get(userController.renderLogIn)
    .post(saveRedirectUrl,passport.authenticate('local',{
    failureRedirect : '/user/login', failureFlash:true}),userController.LogIn);

//logout route

router.get("/logout",userController.logOut);

module.exports = router;