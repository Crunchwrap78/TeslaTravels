"use strict";

(function() {
  angular.module("trips")
  .controller("tripsIndexCtrl", [
    "TripFactory",
    "ItineraryFactory",
    "DestinationFactory",
    tripsIndexCtrlFunction
  ]);

  function tripsIndexCtrlFunction(TripFactory) {
    this.trips = TripFactory.all
    this.newTrip = new TripFactory();
  }
})();
