
(function (angular) {
'use strict';

angular.module('angular-keenio-demos')

.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/demos/overview');
    $urlRouterProvider.when('/', '/demos/overview');

    $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'partials/demos.html',
    controller: 'DemoCtrl'
  })
  .state('demos', {
    abstract: true,
    url:'/demos',
    template: '<ui-view/>'
  })
  .state('demos.overview', {
    url: '/overview',
    templateUrl: 'partials/demos.html',
    controller: 'DemoCtrl'
  });

  $urlRouterProvider.otherwise('/demos/overview');
})

;

})(angular);
