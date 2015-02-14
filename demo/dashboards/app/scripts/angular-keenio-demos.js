
angular.module('angular-keenio-demos')

.directive('tbkKeenPiechartDemoPageviewsByBrowser', [function() {
  var d = {
    controller: ['$scope', 'tbkKeen', function($scope, tbkKeen) {
      $scope.query = new tbkKeen.Query("count", {
        eventCollection: "pageviews",
        groupBy: "user.device_info.browser.family",
        timeframe: {
          start: "2014-05-01T00:00:00.000Z",
          end: "2014-05-05T00:00:00.000Z"
        }
      });

      $scope.chartOptions = {
        chartArea: {
          height: "85%",
          left: "5%",
          top: "5%",
          width: "100%"
        },
        pieHole: 0.4
      };
    }],
    template:
    '<div data-tbk-keen-piechart ' +
    ' query="query" ' +
    ' height="250" ' +
    ' width="auto" ' +
    ' chart-options="chartOptions" ' +
    '></div>'
  };

  return d;
}])

  .directive('tbkKeenAreachartDemoPageviewsByBrowser', [function() {
    var d = {
      controller: ['$scope', 'tbkKeen', function($scope, tbkKeen) {
        $scope.query = new tbkKeen.Query("count", {
          eventCollection: "pageviews",
          interval: "hourly",
          groupBy: "user.device_info.browser.family",
          timeframe: {
            start: "2014-05-04T00:00:00.000Z",
            end: "2014-05-05T00:00:00.000Z"
          }
        });

        $scope.chartOptions = {
          chartArea: {
            height: "85%",
            left: "5%",
            top: "5%",
            width: "80%"
          },
          isStacked: true
        };
      }],
      template:
      '<div data-tbk-keen-areachart ' +
      ' query="query" ' +
      ' height="250" ' +
      ' width="auto" ' +
      ' is-stacked="true" ' +
      ' chart-options="chartOptions" ' +
      '></div>'
    };

    return d;
  }])
  .directive('tbkKeenColumnchartDemoImpressionsByAdvertiser', [function() {
    var d = {
      controller: ['$scope', 'tbkKeen', function($scope, tbkKeen) {
        $scope.query = new tbkKeen.Query("count", {
          eventCollection: "impressions",
          groupBy: "ad.advertiser",
          interval: "hourly",
          timeframe: {
            start: "2014-05-04T00:00:00.000Z",
            end: "2014-05-05T00:00:00.000Z"
          }
        });
        $scope.chartOptions = {
          chartArea: {
            height: "75%",
            left: "10%",
            top: "5%",
            width: "60%"
          },
          isStacked: true,
          groupWidth: "85%"
        };
      }],
      template:
      '<div data-tbk-keen-columnchart ' +
      ' query="query" ' +
      ' height="250" ' +
      ' width="auto" ' +
      ' chart-options="chartOptions" ' +
      '></div>'
    };

    return d;
  }])

  .directive('tbkKeenColumnchartDemoImpressionsByDevice', [function() {
    var d = {
      controller: ['$scope', 'tbkKeen', function($scope, tbkKeen) {
        $scope.query = new tbkKeen.Query("count", {
          eventCollection: "impressions",
          groupBy: "user.device_info.device.family",
          interval: "hourly",
          timeframe: {
            start: "2014-05-04T00:00:00.000Z",
            end: "2014-05-05T00:00:00.000Z"
          }
        });
        $scope.chartOptions = {
          chartArea: {
            height: "75%",
            left: "10%",
            top: "5%",
            width: "60%"
          },
          isStacked: true,
          groupWidth: "85%"
        };
      }],
      template:
      '<div data-tbk-keen-columnchart ' +
      ' query="query" ' +
      ' height="250" ' +
      ' width="auto" ' +
      ' chart-options="chartOptions" ' +
      '></div>'
    };

    return d;
  }])


  .directive('tbkKeenColumnchartDemoImpressionsByCountry', [function() {
    var d = {
      controller: ['$scope', 'tbkKeen', function($scope, tbkKeen) {
        $scope.query = new tbkKeen.Query("count", {
          eventCollection: "impressions",
          groupBy: "user.geo_info.country",
          interval: "hourly",
          timeframe: {
            start: "2014-05-04T00:00:00.000Z",
            end: "2014-05-05T00:00:00.000Z"
          }
        });
        $scope.chartOptions = {
          chartArea: {
            height: "75%",
            left: "10%",
            top: "5%",
            width: "60%"
          },
          isStacked: true,
          groupWidth: "85%"
        };
      }],
      template:
      '<div data-tbk-keen-columnchart ' +
      ' query="query" ' +
      ' height="250" ' +
      ' width="auto" ' +
      ' chart-options="chartOptions" ' +
      '></div>'
    };

    return d;
  }])

;
