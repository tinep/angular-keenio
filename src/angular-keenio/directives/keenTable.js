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

  ;

})(angular);

