(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenMetric', ['tbkKeenClient', function (tbkKeenClient) {
      var prepareClasses = function (scope) {
        var containerClass = scope.containerClass || 'tbk-keen-metric';
        return {
          container: containerClass,
          loading: scope.loadingClass || containerClass + '-loading',
          error: scope.errorClass || containerClass + '-error',
          success: scope.successClass || containerClass + '-success'
        };
      };
      var prepareTexts = function (scope) {
        return {
          prefix: scope.prefix || '',
          postfix: scope.postfix || '',
          loading: scope.loadingText || 'Loading...',
          error: scope.errorText || 'An error occured!'
        };
      };
      var prepareOptions = function (scope) {
        return {
          scale: parseInt(scope.scale, 10) || 0,
          factor: parseFloat(scope.factor) || 1
        };
      };

      var d = {
        scope: {
          query: '=',
          prefix: '@',
          postfix: '@',
          scale: '@',
          factor: '@',
          loadingText: '@',
          errorText: '@',
          containerClass: '@',
          loadingClass: '@',
          successClass: '@',
          errorClass: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.texts = prepareTexts($scope);
          $scope.classes = prepareClasses($scope);
          $scope.options = prepareOptions($scope);

          $scope.flags = {
            loading: false,
            error: false
          };

          $scope.response = null;
        }],
        link: function ($scope, $element) {
          $element.addClass($scope.classes.container);

          var resetState = function () {
            $scope.flags.loading = true;
            $scope.flags.error = false;

            $element.addClass($scope.classes.loading);
            $element.removeClass($scope.classes.success);
            $element.removeClass($scope.classes.error);
          };

          (function fetchMetric() {
            resetState();

            tbkKeenClient.run($scope.query, function (error, response) {
              $scope.response = response;
              $scope.error = error;
              $scope.flags.error = !!error;
              $scope.flags.loading = false;
              $scope.result = error ? null : response.result * $scope.options.factor;

              $element.removeClass($scope.classes.loading);
              $element.addClass(error ? $scope.classes.error : $scope.classes.success);

              $scope.$digest();
            });
          })();
        },
        template: '<span>' +
        '<span data-ng-hide="flags.loading || flags.error">' +
        '{{ texts.prefix }}' +
        '{{ result | number:options.scale }}' +
        '{{ texts.postfix }}' +
        '</span>' +
        '<span data-ng-show="flags.loading">' +
        '{{ texts.loading }}' +
        '</span>' +
        '<span data-ng-show="flags.error">' +
        '{{ texts.error }}' +
        '</span>' +
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
        template: '<span tbk-keen-metric data-query="query"></span>'
      };

      return d;
    }])
  ;

})(angular);
