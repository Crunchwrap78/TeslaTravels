require("../db/connection");
var mongoose = require("mongoose");
var TripModel = mongoose.model("Trip");

module.exports = TripModel;
