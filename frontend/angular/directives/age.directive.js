function myage() {
  function getAge(scope, elem, attrs) {
    var dateOfBirth = new Date('1990-03-21');
    var today = new Date();

    var age = Math.floor((today - dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
    elem.html(age);
  }

  return {
    restrict: 'EA',
    link: getAge
  }
}

angular
  .module('ramaibz')
  .directive('myage', myage);
