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
  .directive("carForm", carForm)
  .controller("indexCtrl", [
    "Car",
    indexCtrl
  ])
  .controller("showCtrl", [
    "Car",
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
    });
    $urlRouterProvider.otherwise("/");
  }

  function Car($resource){
    var Car = $resource("api/cars", {}, {
      update: {method: "PUT"}
    });
     console.log(Car)
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
    console.log("stuff")
  }

  function showCtrl(Car, $stateParams){
    var vm = this;
    Car.find("name", $stateParams.name, function(car){
      vm.car = car;
    });
    vm.update = function(){
      Car.update({name: vm.car.name}, {car: vm.car}, function(){
        console.log("Done!");
      });
    }
  }
})();
