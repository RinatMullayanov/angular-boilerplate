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

    sampleService.getTasks('tmp/tasks.json')
      .success(function (response) {
        vm.tasks = response.tasks;

        var columnElementsById = [];
        vm.columns.forEach(function(column) {
          columnElementsById.push(document.getElementById(column.id));
        });

        dragula(columnElementsById, {
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
            vm.updateTask(currentTask, { status : newStatus});
            loggerService.log('drop: ' + el + ' from:' + source.id + ' to: ' + container.id);
        });
      })
      .error(function (err) {
        loggerService.log('error: ' + err);
      });

    function updateTask (oldTask, changes) {
      loggerService.log('old task: ' + JSON.stringify(oldTask));
      for (var prop in changes) {
        if (changes.hasOwnProperty(prop)) {
          oldTask[prop] = changes[prop];
        }
      }
      loggerService.log('new task: ' + JSON.stringify(oldTask));
      // here will be invoke service method for update task in the database
    }


  }
})();
