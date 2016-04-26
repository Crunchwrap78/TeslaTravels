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
