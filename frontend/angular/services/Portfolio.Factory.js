angular
  .module('ramaibz')
  .factory('PortfolioFactory', portfolioFactory);

function portfolioFactory($http, $q) {
  var results = {};
  var src = 'portfolio.json';
  results.getPortfolio = function() {
    var result = $q.defer();
    $http
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
