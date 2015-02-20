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
    .directive('tbkKeenMetric', ['tbkKeenClient', function (tbkKeenClient) {
      var prepareClasses = function (scope) {
        return {
          loading: scope.loadingClass || 'tbk-angular-keenio-count-metric-loading',
          error: scope.errorClass || 'tbk-angular-keenio-count-metric-error',
          success: scope.successClass || 'tbk-angular-keenio-count-metric-success'
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
          factor: parseInt(scope.factor, 10) || 1
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
          $element.addClass('tbk-angular-keenio-count-metric');

          var resetState = function () {
            $scope.flags.loading = true;
            $scope.flags.error = false;

            $element.addClass($scope.classes.loading);
            $element.removeClass($scope.classes.success);
            $element.removeClass($scope.classes.error);
          };

          (function fetchMetric() {
            resetState();

            tbkKeenClient.run($scope.query, function (err, response) {
              $scope.response = response;
              $scope.result = response.result * $scope.options.factor;

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
        template: '<div tbk-keen-metric data-query="query"></div>'
      };

      return d;
    }])
  ;

})(angular);

(function (angular) {

  angular.module('angular-keenio.directives')

    .directive('tbkKeenPiechart', [function() {
      var d = {
        scope: {
          query: '=',
          title: '@',
          width: '@',
          height: '@',
          pieHole: '@',
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
            pieHole: $scope.pieHole || 0.4
          };
        }],
        template:
        '<div data-tbk-keen-chart="piechart" ' +
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
  ;

})(angular);
