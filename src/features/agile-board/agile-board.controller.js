(function () {
  angular
    .module('rm.agile-board')
    .controller('TaskModalController', TaskModalController);

  TaskModalController.$inject = ['$scope', '$modalInstance', 'items'];
  function TaskModalController ($scope, $modalInstance, items) {
    var vm = this;
    vm.items = items;
    vm.selected = {
      item: vm.items[0]
    };

    vm.ok = function () {
      $modalInstance.close(vm.selected.item);
    };

    vm.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
