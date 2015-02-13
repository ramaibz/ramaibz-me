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
