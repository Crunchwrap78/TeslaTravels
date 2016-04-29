"use strict";

(function(){
  angular
  .module("teslatravels", [
    "ngResource",
    "ui.router"
  ])
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    Router
  ])
  .factory("Car",[
    "$resource",
    Car
  ])
  .factory("Trip",[
    "$resource",
    Trip
  ])
  .directive("carForm", carForm)
  .directive("tripForm", tripForm)
  .controller("indexCtrl", [
    "Car",
    indexCtrl
  ])
  .controller("showCtrl", [
    "Car",
    "$stateParams",
     showCtrl
  ])
  .controller("tripIndex", [
    "Trip",
    tripIndex
  ])
  .controller("tripShow", [
    "Trip",
    "$stateParams",
     tripShow
  ]);
  function Router($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("welcome", {
      url: "/",
      templateUrl: "/public/html/car-welcome.html"
    })
    .state("index", {
      url: "/cars",
      templateUrl: "/public/html/cars-index.html",
      controller: "indexCtrl",
      controllerAs: "indexVM"
    })
    .state("show", {
      url: "/cars/:id",
      templateUrl: "/public/html/cars-show.html",
      controller: "showCtrl",
      controllerAs: "showVM"
    })
    .state("tripShow", {
      url: "/trips/:id",
      templateUrl: "/public/html/trip-show.html",
      controller: "tripShow",
      controllerAs: "tripShowVM"
    })
    .state("tripIndex", {
      url: "/cars/:id/trips",
      templateUrl: "/public/html/trip-index.html",
      controller: "tripIndex",
      controllerAs: "tripIndexVM"
    })
    $urlRouterProvider.otherwise("/");
  }
  function Trip($resource){
    var Trip = $resource("api/trips", {}, {
      update: {method: "PUT"}
    });
    Trip.all = Trip.query();
    Trip.find = function(property, value, callback){
      Trip.all.$promise.then(function(){
        Trip.all.forEach(function(car){
          if(car[property] == value) callback(car);
        });
      });
    }
  return Trip;
}

function tripIndex(Trip){
  var vm = this;
  vm.trips = Trip.all;
  vm.newTrip = new Trip;
  console.log(vm.trips)
}


function tripShow(Trip, $stateParams){
  var vm = this;
  Trip.all.$promise.then(function(){
    Trip.all.forEach(function(trip){
      if(trip.id == $stateParams.id){
        vm.trip = trip;
      }
    });
  });
}

  function Car($resource){
    var Car = $resource("api/cars", {}, {
      update: {method: "PUT"},
      trip: {
        method: "POST",
        url: "api/cars/:id/trips",
        params:{
          name: "@name",
          location: "@location"
        }
      }
    });
      Car.all = Car.query();
      Car.find = function(property, value, callback){
        Car.all.$promise.then(function(){
          Car.all.forEach(function(car){
            if(car[property] == value) callback(car);
          });
        });
      }
    return Car;
  }

  carForm.$inject = [ "$state", "$stateParams", "Car" ];
  function carForm($state, $stateParams, Car){
    var directive = {};
    directive.templateUrl = "/public/html/car-form.html";
    directive.scope = {
      car: "=",
      action: "@"
    }
    directive.link = function(scope){
      var originalName = $stateParams.name;
      scope.create = function(){
        Car.save({car: scope.car}, function(response){
          var car = new Car(response);
          Car.all.push(car);
          $state.go("show", {name: car.name});
        });
      }
      scope.update = function(){
        Car.update({name: originalName}, {car: scope.car}, function(car){
          console.log("Updated!");
          $state.go("show", {name: car.name});
        });
      }
    }
    return directive;
  }

  tripForm.$inject = [ "$state", "$stateParams", "Trip" , "Car"];
  function tripForm($state, $stateParams, Trip, Car){
    var tripdirective = {};
    tripdirective.templateUrl = "/public/html/trip-form.html";
    tripdirective.scope = {
      trip: "=",
      action: "@"
    }
    // console.log("stuff")

      //   var input = document.getElementById('pac-input');
      //   var autocomplete = new google.maps.places.Autocomplete(input);
      //   autocomplete.bindTo('bounds', map);
      //
      //   var infowindow = new google.maps.InfoWindow();
      //   var marker = new google.maps.Marker({
      //     map: map,
      //     anchorPoint: new google.maps.Point(0, -29)
      //   });
      //
      //   scope.trip = [];
      //   autocomplete.addListener('place_changed', function() {
      //     infowindow.close();
      //     marker.setVisible(false);
      //     var place = autocomplete.getPlace();
      //     if (!place.geometry) {
      //       window.alert("Autocomplete's returned place contains no geometry");
      //       return;
      //     } else {
      //       scope.trip.push({location: place.formatted_address, name: place.name});
      //       $("#spots").append("<li class='collection-item'>"+ place.name +"</li>");
      //       $("#pac-input").val('')
      //     }
      //
      //     // If the place has a geometry, present it on the map.
      //     if (place.geometry.viewport) {
      //       map.fitBounds(place.geometry.viewport);
      //     } else {
      //       map.setCenter(place.geometry.location);
      //       map.setZoom(17);
      //     }
      //     marker.setIcon({
      //       url: place.icon,
      //       size: new google.maps.Size(71, 71),
      //       origin: new google.maps.Point(0, 0),
      //       anchor: new google.maps.Point(17, 34),
      //       scaledSize: new google.maps.Size(35, 35)
      //     });
      //     marker.setPosition(place.geometry.location);
      //     marker.setVisible(true);
      //
      //     var address = '';
      //     if (place.address_components) {
      //       address = [
      //         (place.address_components[0] && place.address_components[0].short_name || ''),
      //         (place.address_components[1] && place.address_components[1].short_name || ''),
      //         (place.address_components[2] && place.address_components[2].short_name || '')
      //       ].join(' ');
      //     }
      //
      //     infowindow.setContent('<div><strong>' + place.name +
      //                           '</strong><br>' + address);
      //     infowindow.open(map, marker);
      //   });
      // }

    tripdirective.link = function(scope){
      var originalName = $stateParams.id;
      scope.create = function(){
        console.log("clicked")
      // Car.get({id: $stateParams.id})
        Trip.save({car: scope.car}, function(response){
          var trip = new Trip(response);
          Trip.all.push(trip);
          $state.go("show", {id: trip.id});
        });
      }
      scope.update = function(){
        Car.update({name: originalName}, {trip: scope.trip}, function(trip){
          console.log("Updated!");
          $state.go("show", {id: trip.id});
        });
      }
      console.log("stuff")
      scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.901052, lng: -77.031325},
        zoom: 12,
        scrollwheel: false
      });
    }
    return tripdirective;
  }

  function indexCtrl(Car){
    var vm = this
    vm.cars = Car.all
  }

  function showCtrl(Car, $stateParams){
    var vm = this;
    Car.find("id", $stateParams.id, function(car){
      vm.car = car;
      console.log(vm.car)
    });
    vm.update = function(){
      Car.update({name: vm.car.name}, {car: vm.car}, function(){
        console.log("Done!");
      });
    }
  }
})();
