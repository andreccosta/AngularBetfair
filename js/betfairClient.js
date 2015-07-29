"use strict";

var app = angular.module('betfairClient', ['ngRoute', 'ngAnimate', 'ngMessages'])

.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
})

.directive('toggle', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.bind('click', function($event) {
                element.next().slideToggle();
            });
        }
    }
})

.filter('getMarketById', function() {
    return function(input, id) {
       var i=0, len=input.length;
       for (; i<len; i++) {
          if (+input[i].marketId == +id) {
             return input[i];
         }
     }
     return null;
 }
})

.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'partials/login.partial.html',
		controller: 'LoginController'
	})
	.when('/ladder', {
		templateUrl: 'partials/ladder.partial.html',
		controller: 'LadderController'
	})
	.when('/ladder/:marketId', {
		templateUrl: 'partials/ladder.partial.html',
		controller: 'LadderController'
	})
	.otherwise({
		templateUrl: 'partials/login.partial.html',
		controller: 'LoginController'
	})
});