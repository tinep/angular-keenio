(function (angular) {

  angular.module('angular-keenio.directives')
    .directive('tbkKeenChart', ['fetchDeepObject', function (fetchDeepObject) {
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
					colorMappingProperty: '@',
          labelMappingProperty: '@'
        },
        controller: ['$scope', 'tbkKeenClient', function ($scope, tbkKeenClient) {
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

					var originalLabelMapping = angular.copy($scope.labelMapping);
          var originalColorMapping = angular.copy($scope.colorMapping);

          if (!angular.isUndefined($scope.labelMappingProperty)) {
						angular.forEach(originalLabelMapping, function (label, index) {
							originalLabelMapping[index] = fetchDeepObject(label, $scope.labelMappingProperty);
              });

              $scope.labelMapping = originalLabelMapping;
          }

          if (!angular.isUndefined($scope.colorMappingProperty)) {
						angular.forEach(originalColorMapping, function (label, index) {
							if (angular.isUndefined($scope.labelMappingProperty)) {
								originalColorMapping[index] = fetchDeepObject(label, $scope.colorMappingProperty);
							} else {
								var labelAsIndex = fetchDeepObject(label, $scope.labelMappingProperty);
								originalColorMapping[labelAsIndex] = fetchDeepObject(label, $scope.colorMappingProperty);
							}
						});

						$scope.colorMapping = originalColorMapping;
					}
        }],
        link: function ($scope, $element) {
            $scope.$watch('query', function (query) {
                if (query) {
                    $scope.keenClient.then(function(keenClient){
                        keenClient.draw($scope.query, $element[0], {
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
                    });
                }
            });
        }
      };
      return d;
    }]);

})(angular);