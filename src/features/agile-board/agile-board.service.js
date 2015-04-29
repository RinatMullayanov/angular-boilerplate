(function () {
 'use strict';
  angular
    .module('rm.agile-board')
    .factory('sampleService', sampleService);

  sampleService.$inject = ['$http', '$q'];
  function sampleService ($http, $q) {
    return {
      getTasks: getTasks,
      addTask: addTask,
      updateTask: updateTask,
      deleteTask: deleteTask
    };

    function getTasks(path) {
      return $http.get(path);
    }

    // dummy
    function addTask(newTask) {
      var promise = new Promise(function (resolve, reject) {
        resolve({status: 'success'});
      });
      return promise;
    }

    // dummy
    function updateTask(newTask) {
      var promise = new Promise(function (resolve, reject) {
        resolve({status: 'success'});
      });
      return promise;
    }

    // dummy
    function deleteTask(task) {
      var promise = new Promise(function (resolve, reject) {
        resolve({status: 'success'});
      });
      return promise;
    }
  }
})();
