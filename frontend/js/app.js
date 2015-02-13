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

  PortfolioFactory.getPortfolio().then(function(data) {
    vm.flexisolvePublic = data.subject.flexisolve;
    vm.flexisolveWebPublic = data.website.flexisolve;
    vm.flexisolveImgsPublic = {
      imgs: data.portfolios.flexisolve.public,
      thumbnail: getThumbnail(data.portfolios.flexisolve.public)
    };
    vm.flexisolveImgsIntern = {
      imgs: data.portfolios.flexisolve.internal,
      thumbnail: getThumbnail(data.portfolios.flexisolve.internal)
    };
    vm.skyworx = data.subject.skyworx;
    vm.skyworxImgs = {
      imgs: data.portfolios.skyworx,
      thumbnail: getThumbnail(data.portfolios.skyworx)
    };
    vm.hikImgs = {
      imgs: data.portfolios.hik,
      thumbnail: getThumbnail(data.portfolios.hik)
    };
  });

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
  .factory('PortfolioFactory', portfolioFactory);

function portfolioFactory($http, $q) {
  var results = {};
  results.getPortfolio = function() {
    var result = $q.defer();
    $http
      .get('assets/portfolio.json')
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
    $('html, body').animate({
      scrollTop: $(div).offset().top
    }, time, function(){
      cb && cb();
    });
  }

  return results;
}

angular
  .module('ramaibz')
  .factory('MovePage', movePage);

function movePage(ScrollTop) {
  var res = {};

  res.move = function(scope, elem, attrs, ngModel, onwhat) {
    var pageLength = elem.children().size();
    var page = attrs.setpages; // get template attribute named 'setpages'
    var anim = false;
    var evt;
    ngModel.$setViewValue(0);

    ScrollTop.scroll(page + '0', 0);
    onwhat === 'keydown' ? elem.focus() : ''; // focus the div element to make sliding works
    elem.on(onwhat, function(event) {
      var index = ngModel.$viewValue;

      function apply(getIndex) {
        ScrollTop.scroll(page + getIndex, 700, function() {
          anim = false;
        });
      }

      if(onwhat === 'keydown') { // detect key press
        evt = event.keyCode;
      }

      if(onwhat === 'mousewheel DOMMouseScroll') { // detect mouse scroll
        evt = event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ? 38 : 40 ;
      }

      switch(evt) {
        case 38:
          if(!anim && index >= 1) {
            anim = true;
            ngModel.$setViewValue(index - 1);
            apply(ngModel.$viewValue);
          }
          event.preventDefault();
          break;
        case 40:
          if(!anim && index < (pageLength - 1)) {
            anim = true;
            ngModel.$setViewValue(index + 1);
            apply(ngModel.$viewValue);
          }
          event.preventDefault();
          break;
      }
    })
  }

  return res;
}
