(function (){
  'use strict';

  angular
      .module('rm.agile-board')
      .directive('rmAgileBoardTask', agileBoardTask);

  var taskTemplateUrl = 'features/agile-board/agile-board__task/agile-board__task.html';

  function agileBoardTask () {
    var directive = {
      require: '^rmAgileBoard', // dependency from root directive
      scope: {
        task: '=task'
      },
      templateUrl: taskTemplateUrl,
      restrict: 'EA',
      controller: AgileBoardTaskController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true, // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
      link: function(scope, element, attrs, agileBoardController) {
        scope.vm.openModal = agileBoardController.openModal;
        scope.vm.deleteTask = agileBoardController.deleteTask;
      }
    };
    return directive;

  }

  AgileBoardTaskController.$inject = ['$scope', '$modal', '$log', '$compile', '$templateCache', 'sampleService']; // manually identify dependencies for Angular components
  function AgileBoardTaskController ($scope, $modal, $log, $compile, $templateCache, sampleService) {
    var vm = this;
  }
})();
