"use strict";

// Context based service
app.factory('betfairAPI', ['betfairBettingService', function(betfairBettingService) {
    return {
        listMarkets: function() {
            var from = new Date().setUTCHours(0,0,0,0);
            var to = new Date().setUTCHours(23,59,0,0);

            return betfairBettingService.listMarketCatalogue({
                   "filter": {
                    "eventTypeIds": [
                    "7"
                    ],
                    "marketTypeCodes": [
                    "WIN"
                    ],
                    "marketCountries": [
                    "GB"
                    ],
                    "marketStartTime": {
                        "from": from,
                        "to": to
                    }
                },
                "maxResults": "1000",
                "sort": "FIRST_TO_START",
                "marketProjection": [
                    "MARKET_START_TIME",
                    "RUNNER_METADATA",
                    "RUNNER_DESCRIPTION",
                    "EVENT"
                    ]
            }).success(function(result) { return result; });
        },
        refreshMarkets: function(markets) {
            return betfairBettingService.listMarketBook({
                    "marketIds": markets,
                    "priceProjection": {
                        "priceData": [ "EX_BEST_OFFERS" ]
            }}).success(function(result) { return result; });
        }
    }
}]);

// Store/restore user info using local storage
app.factory('userService', [$window, function($window) {
    return {
        login: null,
        appKey: null,
        ssoid: {
            key: null,
            timestamp: null,
            valid: false
        },
        saveData: function(l, a, s) {
            var x = { login: l, appKey: a, ssoid: { key: s, timestamp: Date.now(), valid: true }};
            $window.localStorage.setItem("UserInfo", JSON.stringify(x));

            this.appKey = x.appKey;
            this.ssoid = x.ssoid;
        },
        restoreData: function() {
            var x = JSON.parse($window.localStorage.getItem("UserInfo"));

            if(!x)
                return;

            this.login = x.login;
            this.appKey = x.appKey;
            this.ssoid = x.ssoid;

            // An SSOID is valid if it has been used less than 30 mins ago (KeepAlive time)
            if(this.appKey && this.ssoid.key && this.ssoid.timestamp && ((Date.now() - this.ssoid.timestamp) / 1000 / 60) < 30)
                this.ssoid.valid = true;
            else if(this.ssoid)
                this.ssoid.valid = false;
        },
        keepAlive: function() {
            this.saveData(this.login, this.appKey, this.ssoid.key);
        },  
        clearData: function() {
            $window.localStorage.removeItem("UserInfo");
        }
    }
}]);

// Betfair API Calls

// Authentication
app.factory('betfairAuthService', ['$http', function($http){
	var baseAddress = "https://identitysso.betfair.com/api/login";

	return {
		requestLogin: function(l, p, a) {
			var request = {
				method: 'POST',
				url: 'https://identitysso.betfair.com/api/login',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded',
               'X-Application': a },
               data: 'username=' + l + '&password=' + p
           };

           return $http(request).success(function(result) {
            return result;
        });
       }
   };
}]);

// Account Endpoint
app.factory('betfairAccountService', ['$http', function($http){
	var apiAddress = "https://api.betfair.com/exchange/account/json-rpc/v1";

	return {
		getBalance: function(wallet) {
			if(!wallet)
				throw('getBalance: Required argument not present');

			var request = {
				cache: true,
				method: 'POST',
				url: apiAddress,
				data: { "jsonrpc" : "2.0",
              "method" : "AccountAPING/v1.0/getAccountFunds",
              "params": { "wallet": wallet} }
          };

          return $http(request).success(function(result) {
            return result;
        }); 
      }
  };
}]);

// Betting Endpoint
app.factory('betfairBettingService', ['$http', function($http){
	var apiAddress = "https://api.betfair.com/exchange/betting/json-rpc/v1";

	return {
		listMarketCatalogue: function(params) {
            if(!params)
                throw("listMarketCatalogue: params required");

			var request = {
				cache: true,
				method: 'POST',
				url: apiAddress,
				data: { "jsonrpc": "2.0",
                        "method": "SportsAPING/v1.0/listMarketCatalogue",
                        "params": params
                }
            };

            return $http(request).success(function(result) {
                return result;
            }); 
        },
        listMarketBook: function(params) {
            if(!params)
                throw("listMarketBook: params required");

            var request = {
                cache: false,
                method: 'POST',
                url: apiAddress,
                data: { "jsonrpc": "2.0",
                        "method": "SportsAPING/v1.0/listMarketBook",
                        "params": params
                }
            };

            return $http(request).success(function(result) {
                return result;
            });
        }
    };
}]);