(function (){
  'use strict';

  angular
    .module('app', [
      'ngRoute',
      'ui.bootstrap',
      'ngSanitize', // adapt-strap requires ngSanitize
      'adaptv.adaptStrap',
      'rm.agile-board'
    ])
})();
