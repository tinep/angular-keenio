;(function(angular, _, undefined) {
'use strict';

angular.module('angular-keenio-demos')

.directive('tbkCodePrettify', [
  '$window',
  function ($window) {
    var directive = {
      scope: {
        lang: '@',
        showLinenums: '@'
      },
      compile: function () {
        // following does not work as expected..
        // var html = $element.html();
        // var pretty = $window.prettyPrintOne(html);
        // $element.html(pretty);
        // ...
        // workaround is to add prettyprint-classes
        // and call `prettyPrint()`:

        return function ($scope, $element) {
          $element.addClass('prettyprint');

          if($scope.lang) {
            $element.addClass('lang-' + $scope.lang);
          }

          if($scope.showLinenums) {
            $element.addClass('linenums');
          }

          setTimeout(function() {
            $window.prettyPrint();
          }, 1);
        };
      }
    };
    return directive;
  }
])

.directive('tbkHeader', function() {
  var d = {
    scope: {},
    templateUrl:'partials/navs/header.html',
    controller: [function() {
    }]
  };

  return d;
})
;
}(angular, _));
