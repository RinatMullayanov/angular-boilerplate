(function () {
 'use strict';
  angular
    .module('rm.agile-board')
    .factory('sampleService', sampleService);

  sampleService.$inject = ['$http'];
  function sampleService ($http) {
    return {
      getFakeData: getFakeData
    };

    function getFakeData(path) {
      return $http.get(path);
    }
  }
})();
