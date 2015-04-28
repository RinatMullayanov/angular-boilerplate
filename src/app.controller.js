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
    // settings for agile-board
    vm.columns = [{
        id: 'submitted_column',
        title: 'Submitted',
        status : 'submitted'
      }, {
        id: 'open_column',
        title: 'Open',
        status : 'open'
      }, {
        id: 'in_progress_column',
        title: 'In progress',
        status : 'in progress'
      }, {
        id: 'fixed_column',
        title: 'Fixed',
        status : 'fixed'
    }];
  }

})();
