(function (angular) {

  angular.module('angular-keenio.config', [])
    .value('angular-keenio.config', {
      debug: true
    });

  angular.module('angular-keenio.directives', []);
  angular.module('angular-keenio.services', []);
  angular.module('angular-keenio', [
    'angular-keenio.config',
    'angular-keenio.directives',
    'angular-keenio.services'
  ]);

})(angular);
