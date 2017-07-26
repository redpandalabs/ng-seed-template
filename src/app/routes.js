'use strict'
angular.module('angular-seed-template.routes', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: 'app/templates/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'ctrl',
                public:true
            })
            .otherwise({
                redirectTo: '/dashboard'
            })
    })
    .run(function($rootScope, $location, VolatileStorage) {

        $rootScope.$on('$routeChangeStart', function(event, next, current) {

            // if not logged in redirect to Sign up page
            if (!next.public && !VolatileStorage.get('authToken')) {
                $location.url('login')

            }

            // If logged in redirect to dashboard
            if (next.public && VolatileStorage.get('authToken')) {
                $location.url('dashboard')
            }
        })

        $rootScope.logout = function() {
          VolatileStorage.remove('authToken')
        }
        $rootScope.userLoggedIn = function() {
            return VolatileStorage.get('authToken')
        }

    })
