angular-keenio
=================

[Keen.io](https://keen.io/docs/data-visualization/) directives for Angular.js.

### Demo
See some examples on the [demo page](https://theborakompanioni.github.io/angular-keenio/).

### Examples

##### html
```html
<div data-tbk-keen-piechart 
  query="query" 
  height="250" 
  width="auto" 
  chart-options="chartOptions" 
></div>
```

##### controller
```javascript
.controller('myPageviewsByBrowserPiechartCtrl', [
'$scope', 'tbkKeen', function($scope, Keen) {
  $scope.query = new Keen.Query("count", {
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
}]);
```

##### config
```javascript
.config(['tbkKeenConfigProvider', function(tbkKeenConfigProvider) {
  var config = {
    projectId: "<MY_PROJECT_ID>",
    readKey: "<MY_READ_KEY>"
  };

  tbkKeenConfigProvider
    .projectId(config.projectId)
    .readKey(config.readKey);
}])
```

Contribute
------------

- Issue Tracker: https://github.com/theborakompanioni/angular-keenio/issues
- Source Code: https://github.com/theborakompanioni/angular-keenio

### Clone Repository
`git clone https://github.com/theborakompanioni/angular-keenio.git`


License
-------

The project is licensed under the MIT license. See
[LICENSE](https://github.com/theborakompanioni/angular-keenio/blob/master/LICENSE) for details.
