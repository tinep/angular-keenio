(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenPiechart', [function () {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          pieHole: '@',
          chartOptions: '=?',
          colors: '=?',
          labels: '=?',
          colorMapping: '=?',
          labelMapping: '=?'
        },
        controller: ['$scope', function ($scope) {
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
        template: '<div data-tbk-keen-chart="piechart" ' +
        ' query="query" ' +
        ' height="{{height}}" ' +
        ' width="{{width}}" ' +
        ' chart-options="chartOptions" ' +
        ' colors="colors" ' +
        ' labels="labels" ' +
        ' color-mapping="colorMapping" ' +
        ' label-Mapping="labelMapping" ' +
        '></div>'
      };

      return d;
    }])

    .directive('tbkKeenDefaultPiechart', [function () {
      var d = {
        scope: {
          analysisType: '@',
          eventCollection: '@',
          groupBy: '@',
          queryOptions: '=?',
          chartOptions: '=?',
          title: '@',
          width: '@',
          height: '@',
          colors: '=?',
          labels: '=?',
          colorMapping: '=?',
          labelMapping: '=?'
        },
        controller: ['$scope', 'tbkKeen', function ($scope, tbkKeen) {
          $scope.analysisType = $scope.analysisType || 'count';

          $scope.height = $scope.height || '250';
          $scope.width = $scope.width || 'auto';
          $scope.queryOptions = $scope.queryOptions;
          $scope.queryOptions.eventCollection = $scope.eventCollection;
          $scope.queryOptions.groupBy = $scope.groupBy;

          $scope.query = new tbkKeen.Query($scope.analysisType, $scope.queryOptions);

          $scope.chartOptions = $scope.chartOptions || {
            chartArea: {
              height: '85%',
              left: '5%',
              top: '5%',
              width: '100%'
            },
            pieHole: 0.4
          };
        }],
        template: '<div data-tbk-keen-piechart ' +
        ' query="query" ' +
        ' height="{{height}}" ' +
        ' width="{{width}}" ' +
        ' title="{{title}}" ' +
        ' chart-options="chartOptions" ' +
        ' colors="colors" ' +
        ' labels="labels" ' +
        ' color-mapping="colorMapping" ' +
        ' label-Mapping="labelMapping" ' +
        '></div>'
      };

      return d;
    }])
  ;

})(angular);
