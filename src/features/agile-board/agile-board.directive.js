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
        config: '=config' // settings directive
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
    
    vm.updateTask = updateTask;
    vm.openModal = openModal;
    vm.deleteTask = deleteTask;

    vm.config.service.get('tmp/tasks.json')
      .success(function (response) {
        vm.tasks = response.tasks;

        var columnElementsById = [];
        if(vm.config.columns) {
          vm.config.columns.forEach(function (column) {
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
        }
        else {
          $log.log('You must specify the column definition for the directive rm-agile-board! (set property config.columns)');
        }
      })
      .error(function (err) {
        $log.log('error: ' + err);
      });

    function updateTask (oldTask, changes) {
      vm.config.service.update(changes)
        .then(function(response) {
          $log.log('old task: ' + JSON.stringify(oldTask));
          for (var prop in changes) {
            if (changes.hasOwnProperty(prop)) {
              oldTask[prop] = changes[prop];
            }
          }
          $log.log('new task: ' + JSON.stringify(oldTask));
          $log.log('update: ' + response.status);
        })
        .catch(function(err) {
          $log.log('update error: ' + err);
        });
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
          vm.config.service.add(task)
            .then(function(response) {
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
              
              if (angular.isArray(taskTemplate)) {
                var linkFn = $compile(taskTemplate[1]);

              } else if (angular.isString(taskTemplate)) {
                var linkFn = $compile(taskTemplate);
              } else {
                  $log.log('error: taskTemplate have wrong type:' + typeof taskTemplate);
              }
              
              var taskContent = linkFn(newScope);
              var td = angular.element('#' + vm.config.columns[0].id); // first column where we will insert
              td.append(taskContent);
              $log.log('add: ' + response.status);
            })
            .catch(function(err) {
              $log.log('add error: ' + err);
            });
        }
        else {
          vm.config.service.update(task)
            .then(function(response) {
              $log.log('update: ' + response.status);
            })
            .catch(function(err) {
              $log.log('update error: ' + err);
            });
        }
      }, function () {
        $log.log('Modal dismissed at: ' + new Date());
      });
    }

    function deleteTask (selectedTask) {
      vm.config.service.delete(selectedTask)
        .then(function(response) {
          var index = vm.tasks.indexOf(selectedTask);
          if (index > -1) {
            vm.tasks.splice(index, 1);
            angular.element('#' + selectedTask.id).remove();
          }
          $log.log('delete: ' + response.status);
        })
        .catch(function (err) {
          $log.log('delete error: ' + err);
        });

    }

  }
})();
