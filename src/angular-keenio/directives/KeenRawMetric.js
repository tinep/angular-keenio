
(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenRawMetric', [
      '$injector', '$filter', 'tbkKeenClient', function ($injector, $filter, tbkKeenClient) {
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
          var hasFilter = scope.filter && $injector.has(scope.filter + 'Filter');
          return {
            scale: parseInt(scope.scale, 10) || 0,
            factor: parseFloat(scope.factor) || 1,
            filter: hasFilter ? scope.filter : null,
            useFilter: hasFilter
          };
        };

        var d = {
          scope: {
            query: '=',
            prefix: '@',
            postfix: '@',
            scale: '@',
            factor: '@',
            filter: '@',
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
              $scope.result = null;
              $scope.response = null;
              $scope.error = null;

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

                if (!error) {
                  var result = response.result * $scope.options.factor;
                  if ($scope.options.useFilter) {
                    $scope.result = $filter($scope.options.filter)(result, $scope.options.scale);
                  } else {
                    $scope.result = $filter('number')(result, $scope.options.scale);
                  }
                }

                $element.removeClass($scope.classes.loading);
                $element.addClass(error ? $scope.classes.error : $scope.classes.success);

                $scope.$digest();
              });
            })();
          },
          template: '<span>' +
          '<span data-ng-hide="flags.loading || flags.error">' +
          '{{ texts.prefix }}' +
          '{{ result }}' +
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

    .directive('tbkKeenDefaultRawMetric', [
      '$injector', '$filter', 'tbkKeenClient', function ($injector, $filter, tbkKeenClient) {

        var d = {
          scope: {
            analysisType: '@',
            targetProperty: '@',
            eventCollection: '@',
            queryOptions: '=?',
            prefix: '@',
            postfix: '@',
            scale: '@',
            factor: '@',
            filter: '@',
            loadingText: '@',
            errorText: '@',
            containerClass: '@',
            loadingClass: '@',
            successClass: '@',
            errorClass: '@'
          },
          controller: ['$scope', 'tbkKeen', function ($scope, tbkKeen) {
            var queryOptions = $scope.queryOptions || {};
            queryOptions.eventCollection = $scope.eventCollection;
            queryOptions.targetProperty = $scope.targetProperty;

            $scope.query = new tbkKeen.Query($scope.analysisType, queryOptions);
          }],
          template: '<span data-tbk-keen-metric ' +
          ' data-query="query" ' +
          ' data-prefix="{{prefix}}" ' +
          ' data-postfix="{{postfix}}" ' +
          ' data-scale="{{scale}}" ' +
          ' data-factor="{{factor}}" ' +
          ' data-filter="{{filter}}" ' +
          ' data-loading-text="{{loadingText}}" ' +
          ' data-error-text="{{errorText}}" ' +
          ' data-container-class="{{containerClass}}" ' +
          ' data-loading-class="{{loadingClass}}" ' +
          ' data-success-class="{{successClass}}" ' +
          ' data-error-class="{{errorClass}}" ' +
          '></span>'
        };

        return d;
      }])
  ;

})(angular);
