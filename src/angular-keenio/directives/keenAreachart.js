(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenAreachart', [function() {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          isStacked: '@',
          chartOptions: '=?',
          colors: '=?',
          labels: '=?',
          colorMapping: '=?',
          labelMapping: '=?'
        },
        controller: ['$scope', function($scope) {
          $scope.chartOptions = $scope.chartOptions || {
            chartArea: {
              height: '85%',
              left: '5%',
              top: '5%',
              width: '80%'
            },
            isStacked: !!$scope.isStacked
          };
        }],
        template:
        '<div data-tbk-keen-chart="areachart" ' +
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
    }]);

})(angular);
