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
