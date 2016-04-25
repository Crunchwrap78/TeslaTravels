var express = require("express");
var parser  = require("body-parser");
var mongoose= require("./db/connection");


var app = express();
var Car = mongoose.model("Car");
app.use("/public", express.static("public"));
app.use(parser.json({extended: true}));

app.get("/api/cars", function(req, res){
  Candidate.find({}).then(function(candidates){
    res.json(cars);
  });
});

app.get("/api/cars/:name", function(req, res){
  Candidate.findOne({name: req.params.name}).then(function(candidate){
    res.json(car);
  });
});

app.post("/api/cars", function(req, res){
  Candidate.create(req.body.candidate).then(function(candidate){
    res.json(car);
  });
});

app.put("/api/car/:name", function(req, res){
  Candidate.findOneAndUpdate({name: req.params.name}, req.body.candidate, {new: true}).then(function(candidate){
    res.json(car);
  });
});

app.get("/*", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(3001, function() {
  console.log("app listening on port 3001")
})
