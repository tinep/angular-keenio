(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenPiechart', [function() {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          pieHole: '@',
          chartOptions: '=?'
        },
        controller: ['$scope', function($scope) {
          $scope.chartOptions = $scope.chartOptions || {
            chartArea: {
              height: '85%',
              left: '5%',
              top: '5%',
              width: '100%'
            },
            pieHole: $scope.pieHole || 0.4
          };
        }],
        template:
        '<div data-tbk-keen-chart="piechart" ' +
        ' query="query" ' +
        ' height="{{height}}" ' +
        ' width="{{width}}" ' +
        ' chart-options="chartOptions" ' +
        '></div>'
      };

      return d;
    }]);

})(angular);
