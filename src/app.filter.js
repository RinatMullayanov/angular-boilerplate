(function () {
  angular
    .module('app')
    .filter('customFilter', customFilter);

  function customFilter () {
    // customFilter(param)
    return function (input, param) {
      return input ? '\u2713' : '\u2718'; //tick or cross
    };
  }
})();
