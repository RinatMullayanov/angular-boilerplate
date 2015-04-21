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
      templateUrl: 'features/agile-board/agile-board.html',
      restrict: 'EA',
      controller: AgileBoardController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
    };
    return directive;

  }

  AgileBoardController.$inject = ['$scope', '$modal', 'sampleService', 'loggerService']; // manually identify dependencies for Angular components
  function AgileBoardController ($scope, $modal, sampleService, loggerService) {
    var vm = this;
    vm.columns = [{
        id: 'submitted_column',
        title: 'Submitted'
      }, {
        id: 'open_column',
        title: 'Open'
      }, {
        id: 'in_progress_column',
        title: 'In progress'
      }, {
        id: 'fixed_column',
        title: 'Fixed'
    }];
    vm.updateTask = updateTask;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;

    sampleService.getTasks('tmp/tasks.json')
      .success(function (response) {
        vm.tasks = response.tasks;

        dragula([submitted_column, open_column, in_progress_column, fixed_column], {
          moves: function (el, container, handle) {
            loggerService.log('moves: ' + el + ' ' + container.id + ' ' +  handle);
            return true;         // elements are always draggable by default
          },
          accepts: function (el, target, source, sibling) {
            loggerService.log('accepts: ' + el + ' from:' + target.id + ' to: ' + source.id);
            return true;         // elements are always draggable by default
          }
          }).on('drop', function (el, container, source) {
            // here we can handle
            var currentTask = angular.element(el).scope().task;
            var newStatus = container.id.replace('_column', '').replace('_', ' ');
            vm.updateTask(currentTask, { status : newStatus})
            loggerService.log('drop: ' + el + ' from:' + source.id + ' to: ' + container.id);
        });
      })
      .error(function (err) {
        loggerService.log('error: ' + err);
      });

    function updateTask(oldTask, changes) {
      loggerService.log('old task: ' + JSON.stringify(oldTask));
      for (var prop in changes) {
        if (changes.hasOwnProperty(prop)) {
          oldTask[prop] = changes[prop];
        }
      }
      loggerService.log('new task: ' + JSON.stringify(oldTask));
      // here will be invoke service method for update task in the database
    }

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
