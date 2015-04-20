(function () {
  angular
    .module('app')
    .controller('SomeController', SomeController);

  SomeController.$inject = ['$scope', '$location', '$routeParams'];
  function SomeController ($scope, $location, $routeParams) {
    var vm = this;
    vm.userId = $routeParams.userId;
    vm.currentDate = new Date();
    vm.isOnline = true;
  }
})();
