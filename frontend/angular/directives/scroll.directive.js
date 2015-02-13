angular
  .module('ramaibz')
  .directive('scrolling', scrollFunction);

function scrollFunction(MovePage) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      MovePage.move(scope, elem, attrs, ngModel, 'mousewheel DOMMouseScroll');
    }
  }
}
