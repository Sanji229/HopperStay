const express = require("express");
const router = express.Router();
const itineraryController = require("../controllers/itinerary.js");
const wrapAsync = require("../utils/wrapAsync.js");

// GET - Show form
router.get("/", itineraryController.renderForm);

// POST - Generate itinerary
router.post("/", wrapAsync(itineraryController.generateItinerary));

module.exports = router;
