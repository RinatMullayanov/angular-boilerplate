(function () {
  'use strict';
  angular
    .module('app')
    .config(configRoute);

  configRoute.$inject = ['$routeProvider', '$locationProvider'];

  function configRoute ($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true); // to remove the extra # in url
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    //
    // $routeProvider.when('/', {
    //  redirectTo: '/home'
    // });
    $routeProvider.when('/home', {
      templateUrl: __dirname + '/template/home.html',
      controller: 'SomeController',
      controllerAs: 'vm'
    });
    $routeProvider.when('/about', {
      templateUrl: __dirname + '/template/about.html'
    });
    $routeProvider.when('/contact', {
      templateUrl: __dirname + '/template/contact.html'
    });
    $routeProvider.when('/user/:userId', {
      templateUrl: __dirname + '/template/user.html',
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
