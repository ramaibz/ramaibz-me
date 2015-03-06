angular
  .module('ramaibz')
  .controller('MenuController', menuController);

function menuController($location, $document) {
  var vm = this;

  vm.location = $location;

  vm.select = function(item) {
    vm.selected = item;
  }
  vm.isActive = function(item) {
    return vm.selected === item;
  }

  vm.showMenu = false;
}
