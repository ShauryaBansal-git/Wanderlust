const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateListing,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing, isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.create));


router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyRoute));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;