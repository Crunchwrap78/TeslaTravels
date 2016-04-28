var express = require("express");
var router = express.Router();
var Car = require("../model/car");
var Trip = require("../model/trip");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

router.get("/api/cars", function(req, res){
  Car.find({}).populate("trips").then(function(cars){
    res.json(cars);
  });
});

router.post("/api/cars", function(req, res){
  Car.create(req.body.car).then(function(car){
    res.json(car);
  });
});

router.get("/api/cars/:id", function(req, res){
  Car.findById(req.params.id).populate("trips").then(function(car){
    res.json(car);
  });
});

router.get("/api/cars/:id/trip", function(req, res){
  Car.findById(req.params.id).populate("trips").then(function(car){
    res.json(car.trips);
  });
});

router.patch("/api/cars/:id", function(req, res){
  Car.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(function(car){
    res.json(car);
  })
});


module.exports = router;
