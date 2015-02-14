
(function (angular) {
'use strict';

angular.module('angular-keenio-demos', [
'angular-keenio',
'ui.router',
'tbk.githubVersion'
])

.filter('reverse', function() {
  return function(items) {
    return items ? items.slice().reverse() : items;
  };
})

.filter('range', ['$log', function($log) {
  return function(input, total) {
    try {
      total = parseInt(total, 10);
      for (var i=0; i<total; i++) {
        input.push(i);
      }
    } catch(e) {
      $log.warn('invalid input in repeatreange' + total);
    }
    return input;
  };
}])



.config(['tbkKeenConfigProvider', function(tbkKeenConfigProvider) {
  var config = {
    projectId: "5368fa5436bf5a5623000000",
    readKey: "3f324dcb5636316d6865ab0ebbbbc725224c7f8f3e8899c7733439965d6d4a2c7f13bf7765458790bd50ec76b4361687f51cf626314585dc246bb51aeb455c0a1dd6ce77a993d9c953c5fc554d1d3530ca5d17bdc6d1333ef3d8146a990c79435bb2c7d936f259a22647a75407921056"
  };

  tbkKeenConfigProvider
    .projectId(config.projectId)
    .readKey(config.readKey);
}])
;

})(angular);
