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
