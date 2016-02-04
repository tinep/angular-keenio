(function (angular) {

  angular.module('angular-keenio.services')

    .value('tbkKeenDefaultConfig', {
      projectId:   'YOUR_PROJECT_ID',   // String (required always)
      writeKey:    'YOUR_WRITE_KEY',     // String (required for sending data)
      readKey:     'YOUR_READ_KEY',       // String (required for querying data)
      protocol: 'https',              // String (optional: https | http | auto)
      host:        'api.keen.io/3.0',        // String (optional)
      requestType: 'jsonp'            // String (optional: jsonp, xhr, beacon)
    })

    .provider('tbkKeenConfig', [function () {
      var config = {};

      this.projectId   = function (projectId) {
        config.projectId = projectId;
        return this;
      };
      this.writeKey    = function (writeKey) {
        config.writeKey = writeKey;
        return this;
      };
      this.readKey     = function (readKey) {
        config.readKey = readKey;
        return this;
      };
      this.protocol    = function (protocol) {
        config.protocol = protocol;
        return this;
      };
      this.host        = function (host) {
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

    .factory('tbkKeenClient', ['tbkKeen', 'tbkKeenConfig', '$q', function (Keen, KeenConfig, $q) {
      var client = new Keen(KeenConfig);

      /**
       * Records a single event in Keen.io.
       * @param collection the collection you want to save the event in.
       * @param properties the properties of the event you want to save.
       * @returns {deferred.promise|{then, catch, finally}}
       */
      function addEvent(collection, properties) {
        var deferred = $q.defer();

        client.addEvent(collection, properties, function (err, res) {
          if (err) {
            deferred.reject(err);
          }
          else {
            deferred.resolve(res);
          }
        });
        return deferred.promise;
      }

      /**
       * Records multiple events in Keen.io.
       * @param events the events you want to save. You have to provide the
       *   following format
       *
       * <pre>
       *  var multipleEvents = {
     *    "purchases": [
     *      { item: "golden gadget", price: 2550, transaction_id: "f029342" },
     *      { item: "a different gadget", price: 1775, transaction_id:
     *   "f029342" }
     *    ],
     *    "transactions": [
     *      { id: "f029342", items: 2, total: 4325 }
     *    ]
     *  };
       * </pre>
       * @returns {deferred.promise|{then, catch, finally}}
       */
      function addEvents(events) {
        var deferred = $q.defer();

        client.addEvents(events, function (err, res) {
          if (err) {
            deferred.reject(err);
          }
          else {
            deferred.resolve(res);
          }
        });
        return deferred.promise;
      }

      return {
        addEvent:  addEvent,
        addEvents: addEvents
      };
    }])

    .factory('tbkKeenHttpGet', [
      'tbkKeenConfig',
      'tbkKeenClient',
      function (keenConfig, keenClient) {
        return function (queryTemplate, params, callback) {
          var query = queryTemplate.replace('<project_id>', keenConfig.projectId);

          var url = keenConfig.protocol + '://' + keenConfig.host + query;

          return keenClient.get(url, params, keenConfig.readKey, callback);
        };
      }])
  ;

})(angular);
