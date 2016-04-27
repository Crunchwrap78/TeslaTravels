var express = require("express");
var router = express.Router();
var Car = require("../model/car");
var Trip = require("../model/trip");

function error(response, message){
  response.status(500);
  response.json({error: message})
}

router.get("/api/trips", function(req, res){
  Trip.find({}).populate("trips").then(function(cars){
    res.json(cars);
  });
});

router.post("/api/trips", function(req, res){
  Trip.create(req.body.trip).then(function(car){
    res.json(car);
  });
});

router.get("api/:vehicle_id", function(req, res){
  Car.findById(req.params.id).populate("car, id").then(function(car){
    res.json(car);
  });
});

router.get("api/:_id/trips", function(req, res){
  Car.findById(req.params.id).populate("car, id").then(function(car){
    res.json(car.trips);
  });
});

router.patch("api/trip/:id", function(req, res){
  Car.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(function(car){
    res.json(car);
  })
});

router.delete("/api/trips/:i_d", function(req, res){
  Trip.findById(req.params.id).then(function(trip){
    Car.findByIdAndUpdate(trip.car.id, {
      $pull: { trips: {id: req.params.id} }
    }).then(function(){
      return trip.remove();
    }).then(function(){
      res.json({success: true});
    })
  });
});


module.exports = router;
