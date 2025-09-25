const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/review.js");
const{validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");


//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;