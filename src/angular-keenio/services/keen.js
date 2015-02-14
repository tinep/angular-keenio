(function (angular) {

  angular.module('angular-keenio.services')

    .value('tbkKeenDefaultConfig', {

    })

    .provider('tbkKeenConfig', [function () {
      var config = {};

      this.projectId = function (projectId) {
        config.projectId = projectId;
        return this;
      };

      this.readKey = function (readKey) {
        config.readKey = readKey;
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
      return new Keen({
        projectId: KeenConfig.projectId,
        readKey: KeenConfig.readKey
      });
    }])
  ;

})(angular);
