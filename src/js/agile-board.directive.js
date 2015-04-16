(function (){
  'use strict';

  angular
    .module('rm.agile-board')
    .directive('rmAgileBoard', agileBoard);

  function agileBoard() {
    var directive = {
      scope: {
        demoOneWayTextBinding: '@one',
        demoTwoWayBinding: '=two'
      },
      templateUrl: 'template/agile-board.html',
      restrict: 'EA',
      controller: AgileBoardController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
    };
    return directive;

  }

  AgileBoardController.$inject = ['$scope', 'sampleService']; // manually identify dependencies for Angular components
  function AgileBoardController ($scope, sampleService) {
    var vm = this;

    sampleService.getFakeData('tmp/fakeData.json')
      .success(function (response) {
        vm.name = response.key;
      })
      .error(function (err) {
        vm.name = 'error';
      });

  }
})();
