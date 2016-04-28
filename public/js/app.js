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
  .controller("indexCtrl", [
    "Car",
    indexCtrl
  ])
  .controller("showCtrl", [
    "Car",
    "Trip",
    "$stateParams",
     showCtrl
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
    .state("tripForm", {
      url: "/trips/new",
      templateUrl: "/public/post.index.html",
      controller: "postIndexController",
      controllerAs: "tripNewVM"
    })
    .state("tripShow", {
      url: "/trips/:id",
      templateUrl: "/public/post.show.html",
      controller: "postShowController",
      controllerAs: "tripShowVM"
    });
    .state("tripIndex", {
      url: "/trip/",
      templateUrl: "/posts/post.index.html",
      controller: "postIndexController",
      controllerAs: "tripIndexVM"
    })
    $urlRouterProvider.otherwise("/");
  }
  function Trip($resource){
    var Trip = $resource("api/trips", {}, {
      update: {method: "PUT"}
    });
    Trip.all = Trip.query();
    console.log(Trip.all)
    Trip.find = function(property, value, callback){
      Trip.all.$promise.then(function(){
        Trip.all.forEach(function(car){
          if(car[property] == value) callback(car);
        });
      });
    }
  return Trip;
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
      console.log(Car.all)
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
      var originalName = $stateParams.id;
      scope.create = function(){
        Car.save({car: scope.car}, function(response){
          var car = new Car(response);
          Car.all.push(car);
          $state.go("show", {id: car.id});
        });
      }
      scope.update = function(){
        Car.update({name: originalName}, {car: scope.car}, function(car){
          console.log("Updated!");
          $state.go("show", {id: car.id});
        });
      }
    }
    return directive;
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
