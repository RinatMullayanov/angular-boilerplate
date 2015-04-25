(function (){
  'use strict';

  angular
      .module('rm.agile-board')
      .directive('rmAgileBoardTask', agileBoardTask);

  function agileBoardTask() {
    var directive = {
      scope: {
        task: '=task',
        tasks: '=tasks'
      },
      templateUrl: 'features/agile-board/agile-board__task/agile-board__task.html',
      restrict: 'EA',
      controller: AgileBoardTaskController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
    };
    return directive;

  }

  AgileBoardTaskController.$inject = ['$scope', '$modal', 'sampleService', 'loggerService']; // manually identify dependencies for Angular components
  function AgileBoardTaskController ($scope, $modal, sampleService, loggerService) {
    var vm = this;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;


    function openModal (currentTask, size) {
      var modalInstance = $modal.open({
        templateUrl: 'agile-board__task-model.html',
        controller: 'TaskModalController',
        controllerAs: 'vm',
        size: size,
        // members that will be resolved and passed to the controller as locals
        resolve: {
          task: function () {
            return !!currentTask
                ? currentTask
                : {
              id: '2000',
              header:'Моя новая задача',
              description: 'Описание моей новой задачи',
              status: 'submitted',
              priority:'normal',
              _isNew: true // mark the task as a new
            };
          }
        }
      });

      modalInstance.result.then(function (task) {
        // here added logic - what to do when you close the modal window
        if(task._isNew) {
          delete  task._isNew;
          vm.tasks.push(task);
        }
      }, function () {
        loggerService.log('Modal dismissed at: ' + new Date());
      });
    }

    function deleteTask(selectedTask) {
      var index = vm.tasks.indexOf(selectedTask);
      if (index > -1) {
        vm.tasks.splice(index, 1);
      }
    }
  }
})();
