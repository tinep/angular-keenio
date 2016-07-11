(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenColumnchart', [function () {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          isStacked: '@',
          groupWidth: '@',
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
              bar: {
                groupWidth: $scope.groupWidth || '85%'
              },
              isStacked: !!$scope.isStacked
            };
        }],
        template: '<div data-tbk-keen-chart="columnchart" ' +
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
