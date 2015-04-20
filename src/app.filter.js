(function () {
  angular
    .module('app')
    .filter('customFilter', customFilter);

  function customFilter () {
    return function (input) {
      return input ? '\u2713' : '\u2718'; //tick or cross
    };
  }
})();
