(function (){
  'use strict';

  angular
      .module('rm.agile-board')
      .directive('rmAgileBoardTask', agileBoardTask);

  var taskTemplateUrl = 'features/agile-board/agile-board__task/agile-board__task.html';

  function agileBoardTask () {
    var directive = {
      scope: {
        firstcolumnid: '@firstcolumnid',
        task: '=task',
        rootvm: '=rootvm'
      },
      templateUrl: 'features/agile-board/agile-board__task/agile-board__task.html',
      restrict: 'EA',
      controller: AgileBoardTaskController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
    };
    return directive;

  }

  AgileBoardTaskController.$inject = ['$scope', '$modal',  '$compile', '$templateCache', 'sampleService', 'loggerService']; // manually identify dependencies for Angular components
  function AgileBoardTaskController ($scope, $modal,  $compile, $templateCache, sampleService, loggerService) {
    var vm = this;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;
    vm.rootvm.taskCtrl = vm;
    vm.tasks = vm.rootvm.tasks;

    var td = angular.element('#' + vm.firstcolumnid); // first column where we will insert
    var taskTemplate = $templateCache.get(taskTemplateUrl);

    function openModal (currentTask, size) {

      var tasksId = vm.tasks.map(function(task) {
        return +task.id;
      });
      var maxTaskId = Math.max.apply(null, tasksId);

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
              id: maxTaskId + 1,
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

          // because we are in last task
          var newScope = $scope.$new(true);
          newScope.vm = {
            task: task,
            openModal: openModal,
            deleteTask: deleteTask
          };

          var linkFn = $compile(taskTemplate[1]);
          var taskContent = linkFn(newScope);
          td.append(taskContent);
        }
      }, function () {
        loggerService.log('Modal dismissed at: ' + new Date());
      });
    }

    function deleteTask (selectedTask) {
      var index = vm.tasks.indexOf(selectedTask);
      if (index > -1) {
        vm.tasks.splice(index, 1);
        angular.element('#' + selectedTask.id).remove();
      }
    }
  }
})();
