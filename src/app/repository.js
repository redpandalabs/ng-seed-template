'use strict'
/**
 *  REST endpoints and http interceptors
 **/

function makeRepository(_, $http, url, rpcMethods) {
    return _.fromPairs(_.map(function(rpcMethod) {
        return [rpcMethod, function(requestBody) {
            return $http.post(_.concat(url, _.concat('/', rpcMethod)), requestBody)
        }]
    }, rpcMethods))
}

angular.module('ng-seed-template.repository', [])
    .factory('VolatileStorage', function($window) {
        return {
            set: function(key, value) {
                $window.sessionStorage.setItem(key, angular.toJson(value))
            },
            get: function(key) {
                return angular.fromJson($window.sessionStorage.getItem(key))
            },
            clear: function() {
                $window.sessionStorage.clear()
            },
            remove: function(key) {
                return $window.localStorage.removeItem(key)
            }
        }
    })
    .factory('HttpInterceptor', function($rootScope, $q, $location, VolatileStorage) {
        return {
            request: function(config) {
                if (VolatileStorage.get('authToken')) {
                    config.headers['auth-token'] = VolatileStorage.get('authToken')
                    for (var attr in config.data) {
                        if (config.data[attr] === null) {
                            config.data[attr] = undefined
                        }
                    }
                    return config
                } else {
                    return config
                }
            },
            response: function(response) {
                return response
            },
            responseError: function(rejection) {
                switch (rejection.status) {
                    case 401:
                        $rootScope.message = {
                            text: 'Please sign in or sign up to continue',
                            type: 'danger',
                            show: true
                        }
                        VolatileStorage.clear()
                        $location.url('/login')
                        break
                    case 403:
                        $location.url('/dashboard')
                        break
                    case 500:
                        $rootScope.message = {
                            text: 'Sorry, an error occured',
                            type: 'danger',
                            show: true
                        }
                }
                return $q.reject(rejection)
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('HttpInterceptor')
    })
