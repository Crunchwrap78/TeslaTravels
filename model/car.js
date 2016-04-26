require("../db/connection");
var mongoose = require("mongoose");
var CarModel = mongoose.model("Car");

module.exports = CarModel;
