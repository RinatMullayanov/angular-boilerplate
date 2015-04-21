(function () {
  angular
    .module('rm.agile-board')
    .controller('TaskModalController', TaskModalController);

  TaskModalController.$inject = ['$scope', '$modalInstance', 'task'];
  function TaskModalController ($scope, $modalInstance, task) {
    var vm = this;
    vm.task = {};
    angular.copy(task, vm.task);

    vm.ok = function () {
      // commit change
      angular.copy(vm.task, task);
      $modalInstance.close(task);
    };

    vm.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
