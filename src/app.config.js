(function () {
  'use strict';
  angular
    .module('app')
    .config(configRoute);

  configRoute.$inject = ['$routeProvider', '$locationProvider', '$logProvider'];

  function configRoute ($routeProvider, $locationProvider, $logProvider) {
    //$logProvider.debugEnabled(false); // for disable $log.log()

    $locationProvider.html5Mode(true); // to remove the extra # in url
    //
    //$routeProvider.when('/', {
    //  redirectTo: '/search'
    //});
    $routeProvider.when('/home', {
      templateUrl: 'template/home.html'
      //controller: 'profileCtrl'
    });
    $routeProvider.when('/about', {
      templateUrl: 'template/about.html'
    });
    $routeProvider.when('/contact', {
      templateUrl: 'template/contact.html'
    });
    $routeProvider.when('/user/:userId', {
      templateUrl: 'template/user.html',
      controller: 'SomeController',
      controllerAs: 'vm'
    });
    //$routeProvider.when('/search', {
    //  templateUrl: 'features/search/view/search.html',
    //  reloadOnSearch: false
    //});
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }
})();

