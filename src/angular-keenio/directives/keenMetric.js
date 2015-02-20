(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenMetric', ['tbkKeenClient', function (tbkKeenClient) {
      var d = {
        scope: {
          query: '=',
          loadingText: '@',
          errorText: '@',
          loadingClass: '@',
          successClass: '@',
          errorClass: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.texts = {
            loading: $scope.loadingText || 'Loading...',
            error: $scope.errorText || 'An error occured!'
          };
          $scope.classes = {
            loading: $scope.loadingClass || 'tbk-angular-keenio-count-metric-loading',
            error: $scope.errorClass || 'tbk-angular-keenio-count-metric-error',
            success: $scope.successClass || 'tbk-angular-keenio-count-metric-success'
          };

          $scope.flags = {
            loading: false,
            error: false
          };

          $scope.response = null;
        }],
        link: function ($scope, $element) {

          $element.addClass('tbk-angular-keenio-count-metric');

          (function fetchMetric() {
            $scope.flags.loading = true;
            $scope.flags.error = false;

            $element.addClass($scope.classes.loading);
            $element.removeClass($scope.classes.success);
            $element.removeClass($scope.classes.error);

            tbkKeenClient.run($scope.query, function (err, response) {
              $scope.response = response;

              $scope.flags.loading = false;
              $element.removeClass($scope.classes.loading);

              if (err) {
                $scope.flags.error = true;
                $element.addClass($scope.classes.error);
              }
              else {
                $scope.flags.error = false;
                $element.addClass($scope.successClass);
              }

              $scope.$digest();
            });
          })();
        },
        template: '<span>' +
        '<span data-ng-hide="flags.loading || flags.error">{{ response.result | number:0 }}</span>' +
        '<span data-ng-show="flags.loading">{{ texts.loading }}</span>' +
        '<span data-ng-show="flags.error">{{ texts.error }}</span>' +
        '</span>'
      };

      return d;
    }])

    .directive('tbkKeenCountUniqueMetric', [function () {
      var d = {
        scope: {
          eventCollection: '@',
          targetProperty: '@',
          queryConfig: '=?'
        },
        controller: ['$scope', 'tbkKeen', function ($scope, tbkKeen) {
          var config = $scope.queryConfig || {};

          config.eventCollection = config.eventCollection || $scope.eventCollection;
          config.targetProperty = config.targetProperty || $scope.targetProperty;

          $scope.query = new tbkKeen.Query('count_unique', config);
        }],
        template: '<div tbk-keen-metric data-query="query"></div>'
      };

      return d;
    }])

  ;

})(angular);
