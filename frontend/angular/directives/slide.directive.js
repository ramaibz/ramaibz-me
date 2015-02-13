angular
  .module('ramaibz')
  .directive('sliding', slideFunction);

function slideFunction(MovePage) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      MovePage.move(scope, elem, attrs, ngModel, 'keydown');
    }
  }
}
