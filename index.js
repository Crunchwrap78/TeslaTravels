var express = require("express");
var app = express();
var path = require("path");
var parser = require("body-parser");
var mongoose= require("./db/connection");

app.use("/public", express.static("public"));
app.use(parser.json({extended: true}));


app.use("/cars", require("./controllers/cars"));
app.use("/trips", require("./controllers/trips"));

app.get("/*", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(3001, function(){
  console.log("Listening on port 3001");
});
