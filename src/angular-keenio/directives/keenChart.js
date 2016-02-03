(function (angular) {

  angular.module('angular-keenio.directives')
    .directive('tbkKeenChart', [function() {
      var d = {
        scope: {
          chartType: '@tbkKeenChart',
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          chartOptions: '=?',
          colors: '=?',
          labels: '=?',
          colorMapping: '=?',
          labelMapping: '=?',
        },
        controller: ['$scope', 'tbkKeenClient', function($scope, tbkKeenClient) {
          $scope.keenClient = tbkKeenClient;

          $scope.height = $scope.height || 250;
          $scope.width = $scope.width || 'auto';
          $scope.title = $scope.title || false;
          $scope.chartOptions = $scope.chartOptions || {
            chartArea: {
              height: '85%',
              left: '5%',
              top: '5%',
              width: '80%'
            }
          };
        }],
        link: function($scope, $element) {
          $scope.keenClient.draw($scope.query, $element[0], {
            chartType: $scope.chartType,
            title: $scope.title,
            height: $scope.height,
            width: $scope.width,
            chartOptions: $scope.chartOptions,
            colors: $scope.colors,
            labels: $scope.labels,
            colorMapping: $scope.colorMapping,
            labelMapping: $scope.labelMapping
          });
        }
      };
      return d;
    }]);

})(angular);
