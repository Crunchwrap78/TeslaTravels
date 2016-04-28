var mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/teslatravels');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CarSchema = new Schema(
  {
    vehicle_id: String,
    name: { type: String, default: "Tesla" },
    model: String,
    type_model: String,
    battery_range: Number,
    photo_url: String,
    trips:[{type: Schema.Types.ObjectId, ref: "Trip"}]
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
   location: String,
   car: {type: ObjectId, ref: "Car"}
});

var CarModel = mongoose.model("Car", CarSchema);
var TripModel = mongoose.model("Trip", TripSchema);

module.exports = {
  CarModel: CarModel,
  TripModel: TripModel,
  mongoose
}
