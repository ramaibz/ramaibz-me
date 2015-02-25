angular
  .module('ramaibz')
  .directive('shortcutkey', shortcutKey);

function shortcutKey($document, $location) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {

      function fApply(path) {
        scope.$apply(function() {
          $location.path(path);
        })
      }

      $document.on('keypress', function(event) {
        var evt = event.keyCode || event.charCode;
        evt === 97 || evt === 49 ? fApply('/introduction') : '';
        evt === 98 || evt === 51 ? fApply('/blog') : '';
        evt === 112 || evt === 50 ? fApply('/portfolio') : '';
      })
    }
  }
}
