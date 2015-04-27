(function (){
  'use strict';

  angular
    .module('rm.agile-board')
    .directive('rmAgileBoard', agileBoard);

  function agileBoard () {
    var directive = {
      scope: {
        //demoOneWayTextBinding: '@one',
        //demoTwoWayBinding: '=two'
      },
      templateUrl: 'features/agile-board/agile-board.html',
      restrict: 'EA',
      controller: AgileBoardController,
      controllerAs: 'vm', // name of the controller to use to access the properties in the markup directive
      bindToController: true // because the scope is isolated, this means need to bind demoOneWayTextBinding and demoTwoWayBinding with this in controller
    };
    return directive;

  }

  AgileBoardController.$inject = ['$scope', '$modal', '$log', '$compile', '$templateCache', 'sampleService']; // manually identify dependencies for Angular components
  function AgileBoardController ($scope, $modal, $log, $compile, $templateCache, sampleService) {
    var vm = this;
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
    
    vm.updateTask = updateTask;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;

    sampleService.getTasks('tmp/tasks.json')
      .success(function (response) {
        vm.tasks = response.tasks;

        var columnElementsById = [];
        vm.columns.forEach(function(column) {
          columnElementsById.push(document.getElementById(column.id));
        });

        dragula(columnElementsById, {
          moves: function (el, container, handle) {
            $log.log('moves: ' + el + ' ' + container.id + ' ' +  handle);
            return true;         // elements are always draggable by default
          },
          accepts: function (el, target, source, sibling) {
            $log.log('accepts: ' + el + ' from:' + target.id + ' to: ' + source.id);
            return true;         // elements are always draggable by default
          }
          }).on('drop', function (el, container, source) {
            // here we can handle
            var currentTask = angular.element(el).scope().task || angular.element(el).scope().vm.task;
            vm.updateTask(currentTask, { status : container.dataset.status});
            $log.log('drop: ' + el + ' from:' + source.id + ' to: ' + container.id);
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

          var taskTemplate = $templateCache.get('features/agile-board/agile-board__task/agile-board__task.html');
          var linkFn = $compile(taskTemplate[1]);
          var taskContent = linkFn(newScope);
          var td = angular.element('#' + vm.columns[0].id); // first column where we will insert
          td.append(taskContent);
        }
      }, function () {
        $log.log('Modal dismissed at: ' + new Date());
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
