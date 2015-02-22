(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenTable', ['tbkKeenClient', function (tbkKeenClient) {
      var d = {
        scope: {
          query: '=',
          title: '@',
          height: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.options = {
            title: $scope.title || '',
            height: $scope.height || 340
          };
        }],
        link: function ($scope, $element) {
          tbkKeenClient.draw($scope.query, $element[0], {
            chartType: 'table',
            title: $scope.options.title,
            height: $scope.options.height
          });
        },
        template: '<div></div>'
      };

      return d;
    }])

    .directive('tbkKeenDefaultTable', [function () {
      var d = {
        scope: {
          title: '@',
          analysisType: '@',
          eventCollection: '@',
          queryOptions: '=?'
        },
        controller: ['$scope', 'tbkKeen', function ($scope, tbkKeen) {
          var queryOptions = $scope.queryOptions || {};
          queryOptions.eventCollection = $scope.eventCollection;
          $scope.analysisType = $scope.analysisType || 'extraction';
          $scope.query = new tbkKeen.Query($scope.analysisType, queryOptions);
        }],
        template: '<div tbk-keen-table ' +
        ' data-query="query" ' +
        ' data-title="{{title}}"' +
        '></div>'
      };

      return d;
    }])
  ;

})(angular);

