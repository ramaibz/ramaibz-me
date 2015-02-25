angular
  .module('ramaibz')
  .constant('start_req', 'start_req')
  .constant('end_req', 'end_req')
  .config(spinnerConfig)
  .directive('loadingevent', imgLoaded);

function spinnerConfig($httpProvider, start_req, end_req) {
  var $http;
  var interceptor = function($q, $injector) {
    var rootScope;

    function success(response) {
      $http = $http || $injector.get('$http');
      if($http.pendingRequests.length < 1) {
        rootScope = rootScope || $injector.get('$rootScope');
        rootScope.$broadcast(end_req);
      }
      return response;
    }

    function error(response) {
      $http = $http || $injector.get('$http');
      if($http.pendingRequests.length < 1) {
        rootScope = rootScope || $injector.get('$rootScope');
        rootScope.$broadcast(end_req);
      }
      return $q.reject(response);
    }

    return function(promise) {
      rootScope = rootScope || $injector.get('$rootScope');
      rootScope.$broadcast(start_req);
      return promise.then(success, error);
    }
  };
  //$httpProvider.responseInterceptors.push(interceptor);
}

function imgLoaded(start_req, end_req) {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      elem.hide();

      scope.$on(start_req, function() {
        element.show();
      })

      scope.$on(end_req, function() {
        element.hide();
      })
    }
  }
}


angular
  .module('ramaibz')
  .directive('imageloaded', imageGallery)

function imageGallery() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      scope.bool = true;
      elem.bind('load', function() {
        scope.$apply(function() {
          scope.bool = true;
        })
      })
    }
  }
}
