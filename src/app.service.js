(function () {
  'use strict';
  angular
    .module('app')
    .factory('loggerService', loggerService);

  function loggerService ($http) {
    return {
      log: log
    };

    function log(msg) {
      console.log(msg);
    }
  }
})();

