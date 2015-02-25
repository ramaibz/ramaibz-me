'use strict';

angular
  .module('ramaibz', ['ui.router', 'ngAnimate'])
  .config(routes);

function routes($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('parent', {
      url: '/',
      abstract: true,
      templateUrl: '/views/partials/menu.html'
    })
    .state('parent.index', { url: '' })
    .state('intro', {
      url: '/introduction',
      templateUrl: '/views/partials/introduction.html',
      controller: 'IntroController',
      controllerAs: 'vm'
    })
    .state('portfolio', {
      url: '/portfolio',
      templateUrl: '/views/partials/portfolio.html',
      controller: 'PortfolioController',
      controllerAs: 'vm'
    })
    .state('blog', {
      url: '/blog',
      templateUrl: '/views/partials/blog.html',
      controller: 'BlogController',
      controllerAs: 'vm'
    });

    $locationProvider.html5Mode(true);
}

angular
  .module('ramaibz')
  .controller('IntroController', introController);

function introController() {
  var vm = this;

}

angular
  .module('ramaibz')
  .controller('PortfolioController', portfolioController);

function portfolioController(PortfolioFactory, $scope) {
  var vm = this;

  function getThumbnail(rawData) {
    var raw = rawData;
    var thumbData = [];
    for(var i = 0; i < raw.length; i++) {
      thumbData.push(raw[i].replace('imgs', 'thumbnail'));
    }
    return thumbData;
  }

  var oldIndex;
  vm.getPhoto = function(subject, index, obj) {
    if(subject[index] !== oldIndex) {
      $scope.bool = false;
      vm.photo = subject[index];
      oldIndex = vm.photo;
    }

    $('div.thumbnail').removeClass('active-thumbnail');
    $(obj.currentTarget).addClass('active-thumbnail');
  }

  $scope.$watch('index', function() {
    $('.thumbnail').removeClass('active-thumbnail');
    vm.photo = ' ';
  })
  PortfolioFactory.getPortfolio().then(function(data) {
    vm.flx = {
      name: data.FLX.name,
      url: data.FLX.url,
      imgs: data.FLX.imgs,
      thumb: getThumbnail(data.FLX.imgs)
    }

    vm.pkjkt = {
      name: data.PKJKT.name,
      url: data.PKJKT.public.url,
      public: {
        imgs: data.PKJKT.public.imgs.public,
        thumbs: getThumbnail(data.PKJKT.public.imgs.public)
      },
      jamnas: {
        imgs: data.PKJKT.public.imgs.specific,
        thumbs: getThumbnail(data.PKJKT.public.imgs.specific)
      },
      internal: {
        imgs: data.PKJKT.internal.imgs,
        thumbs: getThumbnail(data.PKJKT.internal.imgs)
      }
    }

    vm.uwo = {
      name: data.UWO.name,
      f: {
        imgs: data.UWO.f.imgs,
        thumbs: getThumbnail(data.UWO.f.imgs)
      },
      skw: {
        imgs: data.UWO.SKW.imgs,
        thumbs: getThumbnail(data.UWO.SKW.imgs)
      },
      hik: {
        imgs: data.UWO.HIK.imgs,
        thumbs: getThumbnail(data.UWO.HIK.imgs)
      }
    }

    vm.mas = {
      name: data.MAS.name,
      url: data.MAS.url
    }

  });
}

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
}

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

angular
  .module('ramaibz')
  .filter('trusted', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);

angular
  .module('ramaibz')
  .factory('PortfolioFactory', portfolioFactory);

function portfolioFactory($http, $q) {
  var results = {};
  var src = 'https://d1ageymrjbrol5.cloudfront.net/assets/portfolio.json';
  results.getPortfolio = function() {
    var result = $q.defer();
    var portfolio = $http
      .get(src)
      .success(function(data) {
        result.resolve(data);
      })
      .error(function(err) {
        result.resolve(err);
      });
    return result.promise;
  };
  return results;
}

angular
  .module('ramaibz')
  .service('ScrollTop', scrollTop);

function scrollTop() {
  var results = {};
  results.scroll = function(div, time, cb) {
    // $('html, body').animate({
    //   scrollTop: $(div).offset().top
    // }, time, function(){
    //   cb && cb();
    // });
  }

  return results;
}

angular
  .module('ramaibz')
  .factory('MovePage', movePage);

function movePage(ScrollTop) {
  var res = {};

  res.move = function(scope, elem, attrs, ngModel, onwhat) {
    var pageLength = elem.children('div.pages').size();
    var page = attrs.setpages; // get template attribute named 'setpages'
    var anim = false;
    var evt;
    ngModel.$setViewValue(0);

    ScrollTop.scroll(page + '0', 0);
    onwhat === 'keydown' ? elem.focus() : ''; // focus the div element to make sliding works
    elem.on(onwhat, function(event) {
      var index = ngModel.$viewValue;

      function apply(getIndex, slideType) {
        elem.children('div.pages').removeClass('slideUp slideDown isActive isActiveFirst');
        elem.find(page + index).addClass('isActive');
        elem.children(page + getIndex).addClass(slideType).on('animationend webkitAnimationEnd', function() {
          anim = false;
        })
      }

      function setPageAnim(getIndex, animClass) {
        anim = true;
        ngModel.$setViewValue(getIndex);
        apply(ngModel.$viewValue, animClass);
      }

      onwhat === 'keydown' ? evt = event.keyCode : '';
      onwhat === 'mousewheel DOMMouseScroll' ? evt = event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ? 38 : 40 : '';

      switch(evt) {
        case 38:
          if(!anim && index >= 1) {
            setPageAnim(index - 1, 'slideUp');
          }
          if(!anim && index === 0) {
            setPageAnim(pageLength - 1, 'slideUp')
          }
          event.preventDefault();
          break;
        case 40:
          if(!anim && index < (pageLength - 1)) {
            setPageAnim(index + 1, 'slideDown');
          }
          if(!anim && index === (pageLength - 1)) {
            setPageAnim(0, 'slideDown');
          }
          event.preventDefault();
          break;
      }
    })
  }

  return res;
}
