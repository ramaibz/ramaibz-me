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
    .state('works', {
      url: '/works',
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
