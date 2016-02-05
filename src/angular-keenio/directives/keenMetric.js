(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenMetric', [function () {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          chartOptions: '=?',
          colors: '=?'
        },
        template:
        '<div data-tbk-keen-chart="metric" ' +
        ' title="{{title}}" ' +
        ' query="query" ' +
        ' height="{{height}}" ' +
        ' width="{{width}}" ' +
        ' chart-options="chartOptions" ' +
        ' colors="colors" ' +
        '></div>'
      };

      return d;
    }]);
})(angular);
