var app = angular.module('wikiApp', []);
app.controller('myCtrl', function($scope, $http) {

  $scope.searchUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&callback=JSON_CALLBACK&gsrsearch=';
  $scope.results = [];
  $scope.recentSearches = [];
  var length = 0;
  var prevSearch = "";
  var page = 'https://en.wikipedia.org/?curid=';
  $scope.getRandom = function() {
    window.open('https://en.wikipedia.org/wiki/Special:Random', 'resizable=yes');
  }

  $scope.getFromWiki = function(str) {
    $scope.searchString = str;
    if (prevSearch.length != 0 && $scope.recentSearches.indexOf(prevSearch) <= -1) {
      length = $scope.recentSearches.push(prevSearch);
      if (length == 5) {
        $scope.recentSearches.shift();
      }
    }
    prevSearch = str;
    $http.jsonp($scope.searchUrl + str).success(
      function(data) {
        console.log(data);
        var results = data.query.pages;
        $scope.results = [];
        angular.forEach(results, function(v, k) {
          $scope.results.push({
            title: v.title,
            body: v.extract,
            page: page + v.pageid,
            thumbnail: v.thumbnail
          })
        });
        console.log($scope.results);

      }
    );
  }
  $scope.goSearch = function(keyEvent) {
    if (keyEvent.which === 13) {
      angular.element(document.querySelector(".mainDiv")).removeClass("centered");
      angular.element(document.querySelector(".mainDiv")).addClass("col-md-6");
      console.log($scope.searchString);
      $scope.getFromWiki($scope.searchString);

    }
  }
});