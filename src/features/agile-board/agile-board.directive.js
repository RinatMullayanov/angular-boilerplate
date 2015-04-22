(function (){
  'use strict';

  angular
    .module('rm.agile-board')
    .directive('rmAgileBoard', agileBoard);

  function agileBoard () {
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

  AgileBoardController.$inject = ['$scope', '$modal', '$log', 'sampleService']; // manually identify dependencies for Angular components
  function AgileBoardController ($scope, $modal, $log, sampleService) {
    var vm = this;
    vm.columns = [{
        id: 'submitted_column',
        title: 'Submitted',
        status: 0,
        statusDescr : 'submitted'
      }, {
        id: 'open_column',
        title: 'Open',
        status: 1,
        statusDescr : 'open'
      }, {
        id: 'in_progress_column',
        title: 'In progress',
        status: 2,
        statusDescr: 'in progress'
      }, {
        id: 'fixed_column',
        title: 'Fixed',
        status: 3,
        statusDescr: 'fixed'
    }];
    vm.updateTask = updateTask;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;

    vm.onDragStart = function(data, dragElement, event) {
      data._isSelected = true;
    };

    vm.onDragEnd = function(data, dragElement, event) {
    };

    vm.onDragOver = function(data, dragElement, event) {

    };

    vm.onDrop = function(data, dragElement, dropElement, event) {
      if (data) {
        data._isSelected = false;
        var currentTask = angular.element(dragElement.el).scope().task;
        vm.updateTask(currentTask, {
          status: +dropElement.el[0].dataset.status,
          statusDescr: dropElement.el[0].dataset.statusdescr
        });
        //$scope.models.basket.push(data);
        //$scope.remove($scope.models.cars, data);
      }
    };

    sampleService.getTasks('tmp/tasks.json')
      .success(function (response) {
        vm.tasks = response.tasks;

        var columnElementsById = [];
        vm.columns.forEach(function(column) {
          columnElementsById.push(document.getElementById(column.id));
        });
      })
      .error(function (err) {
          $log.log('error: ' + err);
      });

    function updateTask (oldTask, changes) {
      $log.log('old task: ' + JSON.stringify(oldTask));
      for (var prop in changes) {
        if (changes.hasOwnProperty(prop)) {
          oldTask[prop] = changes[prop];
        }
      }
      $log.log('new task: ' + JSON.stringify(oldTask));
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
                  status: 0,
                  'statusDescr' : 'submitted',
                  priority: 'normal',
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
          $log.log('Modal dismissed at: ' + new Date());
      });
    }

    function deleteTask (selectedTask) {
      var index = vm.tasks.indexOf(selectedTask);
      if (index > -1) {
        vm.tasks.splice(index, 1);
      }
    }
  }
})();
