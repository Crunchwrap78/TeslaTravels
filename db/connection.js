var mongoose  = require("mongoose");

var CarSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Tesla" },
    model: String,
    type_model: String,
    battery_range: String,
    photo_url: String,
    trip:[{type: ObjectId, ref: "Trip"}]
  },
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  }
);

CarSchema.virtual("id").get(function(){
  return this._id;
});


var TripSchema = new Schema({
   name: String,
   location: String
   car: {type: ObjectId, ref: "Car"}
});

mongoose.model("Car", CarSchema);
mongoose.model("Trip", TripSchema);

module.exports = mongoose;
