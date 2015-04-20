(function () {
 'use strict';
  angular
    .module('rm.agile-board')
    .factory('sampleService', sampleService);

  sampleService.$inject = ['$http'];
  function sampleService ($http) {
    return {
      getTasks: getTasks
    };

    function getTasks(path) {
      return $http.get(path);
    }
  }
})();
