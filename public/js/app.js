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
  .factory("Car", Car)
  .directive("carForm", carForm)
  .controller("indexCtrl", indexCtrl)
  .controller("showCtrl", showCtrl);

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
      controllerAs: "vm"
    })
    .state("show", {
      url: "/cars/:_id",
      templateUrl: "/public/html/cars-show.html",
      controller: "showCtrl",
      controllerAs: "vm"
    });
    $urlRouterProvider.otherwise("/");
  }

  Car.$inject = [ "$resource" ];
  function Car($resource){
    var Car = $resource("/api/car/:_id", {}, {
      update: {method: "PUT"}
    });
    Car.all = Car.query();
    return Car;
  }

  carForm.$inject = [ "$state", "$stateParams", "Car" ];
  function carForm($state, $stateParams, Car){
    var directive = {};
    directive.templateUrl = "/public/html/car-form.html";
    directive.scope = {
      candidate: "=",
      action: "@"
    }
    directive.link = function(scope){
      var originalName = $stateParams._id;
      scope.create = function(){
        Car.save({car: scope.car}, function(response){
          var car = new Car(response);
          Car.all.push(car);
          $state.go("show", {_id: car._id});
        });
      }
      scope.update = function(){
        Car.update({name: originalName}, {car: scope.candidate}, function(car){
          console.log("Updated!");
          $state.go("show", {_id: car._id});
        });
      }
    }
    return directive;
  }
  indexCtrl.$inject = [ "Car" ];
  function indexCtrl(Candidate){
    var vm = this;
    vm.candidates = Candidate.all;
  }
  showCtrl.$inject = [ "$stateParams", "Car" ];
  function showCtrl($stateParams, Candidate){
    var vm = this;
    Car.all.$promise.then(function(){
      Car.all.forEach(function(candidate){
        if(car.vehicle_id === $stateParams.vehicle_id){
          vm.car = car;
        }
      });
    });
  }

})();
