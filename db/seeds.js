require('./connection');
var mongoose  = require('mongoose');
var db = mongoose.connection;
var carData = require("./car_data");
var tripData = require("./trip_data");

db.on("error", function(err){
  console.log("Oops! Mongo threw an error. Is `mongod` running?");
  console.log(err.message);
  process.exit();
});

db.once("open", function(){
  console.log("Connected to the database.");
});

var Car = require("../model/car");
var Trip = require("../model/trip")
Trip.remove({}).then(function(){
  Car.remove({}).then(function(){
    carData.forEach(function(carDatum){
      new Car(carDatum).save().then(function(car){
        console.log(tripData[car.vehicle_id])
        tripData[car.vehicle_id].forEach(function(tripDatum){
          trip = new Trip(tripDatum);
          console.log(car.name + " driving for " + trip.name);
          trip.car = car;
          return trip.save().then(function(trip){
            console.log(trip)
            car.trips.push(trip);
            car.save();
          });
        })
      });
    }).then(function(){
   process.exit();
  });
});
});



function forEach(collection, callback, index){
  if(!index) index = 0;
  return callback(collection[index]).then(function(){
    if(collection[index + 1]) return forEach(collection, callback, index + 1);
  });
}
