"use strict";

app.controller('LoginController', function($scope, $location, $timeout, userService, betfairAuthService) {
	userService.restoreData();  // Try and fetch user info from localStorage if any
    $scope.user = userService;
    
    $scope.showLoading = false;
	
	$scope.status = { hasError: false };
	$scope.error = "Something went wrong.";

	if($scope.user.ssoid.valid) // If we have a valid user and SSOID then skip login
		$location.path('ladder');

	$scope.login = function(isValid) {
		$scope.status.hasError = false;

		if(!isValid)
			return;

		$scope.showLoading = true;

		// Call API
		betfairAuthService.requestLogin($scope.inputLogin, $scope.inputPassword, $scope.inputAppKey)
			.success(function(data) {
				$scope.showLoading = false;

				if(!data.token) {
					$scope.status.hasError = true;
					$scope.error = data.status;
				} else {
					$scope.user.saveData($scope.inputLogin, $scope.inputAppKey, data.token);
				}

				if($scope.user.ssoid.valid)
					$location.path('ladder');
			});
	};
});

app.controller('LadderController', function($scope, $filter, $location, $timeout, $interval, $http, $routeParams, userService, betfairAccountService, betfairBettingService) {
	userService.restoreData();
	$scope.user = userService;

	if(!$scope.user || !$scope.user.ssoid.valid)
		$location.path('login');

	$http.defaults.headers.common['X-Application'] = $scope.user.appKey;
	$http.defaults.headers.common['X-Authentication'] = $scope.user.ssoid.key;

	$scope.user.keepAlive();

    betfairAccountService.getBalance("UK")
	    .success(function(data) {
	    	if(data.error) {
	    		console.log(data.error);
	    		return;
	    	}

	        $scope.user.balance = data.result.availableToBetBalance;
	    })
	    .error(function(result) {
	    	$scope.error = "Something went wrong";
	    });

    betfairAPI.listMarkets()
    .success(function(data) {
    	// TODO - Check for erros (even though HTTP request was marked as being successful)
        $scope.markets = data.result;

        if(!$routeParams.marketId)
        	$scope.marketId = $scope.markets[0].marketId;
        else
        	$scope.marketId = $routeParams.marketId;

        $scope.setMarket();

        betfairBettingService.refreshMarkets([$scope.marketId])
		.success(function(data) {
			angular.merge($scope.currentMarket, data.result[0]);
			$scope.refreshInterval = $interval(refreshMarket, 5000);
		});
    })
    .error(function(result) {
    	// TODO - Proper error message
    	console.log(result);
    	$scope.error = "Something went wrong";
    });

    var refreshMarket = function() {
		betfairAPI.refreshMarkets([$scope.marketId])
		.success(function(data) {
			angular.merge($scope.currentMarket, data.result[0]);
			console.log($scope.currentMarket);
		});
	}

	// TODO - Dont destroy. Keep last x markets in the background being updated
	$scope.$on('$destroy', function() {
		$interval.cancel($scope.refreshInterval);
	});

	// TODO - Does this really need its own function?
	$scope.setMarket = function(id) {
		var found = $filter('getMarketById')($scope.markets, $scope.marketId);
        $scope.currentMarket = found;
	}

	$scope.logout = function() {
		$scope.user.clearData(); // Remove data from local storage
		delete $scope.user; // Delete scoped information
		$location.path('login'); // Go back to login
	}
});