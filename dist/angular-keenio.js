(function (angular) {

  angular.module('angular-keenio.config', [])
      .value('angular-keenio.config', {
          debug: true
      });

  // Modules
  angular.module('angular-keenio.directives', []);
  angular.module('angular-keenio.services', []);
  angular.module('angular-keenio',
      [
          'angular-keenio.config',
          'angular-keenio.directives',
          'angular-keenio.services'
      ]);

})(angular);

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
          chartOptions: '=?'
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
        '></div>'
      };

      return d;
    }]);

})(angular);

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
          chartOptions: '=?'
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
            chartOptions: $scope.chartOptions
          });
        }
      };
      return d;
    }]);

})(angular);

(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenColumnchart', [function() {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          isStacked: '@',
          groupWidth: '@',
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
            bar: {
              groupWidth: $scope.groupWidth || '85%'
            },
            isStacked: !!$scope.isStacked
          };
        }],
        template:
        '<div data-tbk-keen-chart="columnchart" ' +
        ' query="query" ' +
        ' height="{{height}}" ' +
        ' width="{{width}}" ' +
        ' chart-options="chartOptions" ' +
        '></div>'
      };

      return d;
    }]);

})(angular);

(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenMetric', [
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

    .directive('tbkKeenDefaultMetric', [
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
          chartOptions: '=?'
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
          height: '@'
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
        '></div>'
      };

      return d;
    }])
  ;

})(angular);

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

    .directive('tbkKeenDefaultTable', [function () {
      var d = {
        scope: {
          title: '@',
          analysisType: '@',
          eventCollection: '@',
          queryOptions: '=?'
        },
        controller: ['$scope', 'tbkKeen', function ($scope, tbkKeen) {
          var queryOptions = $scope.queryOptions || {};
          queryOptions.eventCollection = $scope.eventCollection;
          $scope.analysisType = $scope.analysisType || 'extraction';
          $scope.query = new tbkKeen.Query($scope.analysisType, queryOptions);
        }],
        template: '<div tbk-keen-table ' +
        ' data-query="query" ' +
        ' data-title="{{title}}"' +
        '></div>'
      };

      return d;
    }])
  ;

})(angular);


(function (angular) {

  angular.module('angular-keenio.services')

    .value('tbkKeenDefaultConfig', {
      projectId: 'YOUR_PROJECT_ID',   // String (required always)
      writeKey: 'YOUR_WRITE_KEY',     // String (required for sending data)
      readKey: 'YOUR_READ_KEY',       // String (required for querying data)
      protocol: 'https',              // String (optional: https | http | auto)
      host: 'api.keen.io/3.0',        // String (optional)
      requestType: 'jsonp'            // String (optional: jsonp, xhr, beacon)
    })

    .provider('tbkKeenConfig', [function () {
      var config = {};

      this.projectId = function (projectId) {
        config.projectId = projectId;
        return this;
      };
      this.writeKey = function (writeKey) {
        config.writeKey = writeKey;
        return this;
      };
      this.readKey = function (readKey) {
        config.readKey = readKey;
        return this;
      };
      this.protocol = function (protocol) {
        config.protocol = protocol;
        return this;
      };
      this.host = function (host) {
        config.host = host;
        return this;
      };
      this.requestType = function (requestType) {
        config.requestType = requestType;
        return this;
      };

      this.$get = ['tbkKeenDefaultConfig', function (defaultConfig) {
        return angular.extend(defaultConfig, config);
      }];
    }])

    .factory('tbkKeen', ['$window', function ($window) {
      return $window.Keen;
    }])

    .factory('tbkKeenClient', ['tbkKeen', 'tbkKeenConfig', function (Keen, KeenConfig) {
      return new Keen(KeenConfig);
    }])

    .factory('tbkKeenHttpGet', [
      'tbkKeenConfig',
      'tbkKeenClient',
      function (keenConfig, keenClient) {
        return function (queryTemplate, params, callback) {
          var query = queryTemplate.replace('<project_id>', keenConfig.projectId);

          var url = keenConfig.protocol + '://' + keenConfig.host + query;

          return keenClient.get(url, params, keenConfig.readKey, callback);
        };
      }])
  ;

})(angular);
