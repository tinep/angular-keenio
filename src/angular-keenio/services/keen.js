(function (angular) {

  angular.module('angular-keenio.services')

    .value('tbkKeenDefaultConfig', {
      projectId:   'YOUR_PROJECT_ID',   // String (required always)
      writeKey:    'YOUR_WRITE_KEY',    // String (required for sending data)
      readKey:     'YOUR_READ_KEY',     // String (required for querying data)
      masterKey:   'YOUR_MASTER_KEY',   // String (required for getting data of
                                        // collections)
      protocol:    'https',             // String (optional: https | http |
                                        // auto)
      host:        'api.keen.io/3.0',   // String (optional)
      requestType: 'jsonp'              // String (optional: jsonp, xhr, beacon)
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
      this.masterKey   = function (masterKey) {
        config.masterKey = masterKey;
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

    /**
     * Provides the Keen.io client for your Angular application.
     * If you want to work in a more angular way, you should use the `angularKeenClient` factory
     * which will use promises instead of callbacks
     */
    .factory('tbkKeenClient', ['tbkKeen', 'tbkKeenConfig', function (Keen, KeenConfig) {
      return new Keen(KeenConfig);
    }])

    .factory('tbkKeenHttpGet', ['tbkKeenConfig', 'tbkKeenClient', function (keenConfig, keenClient) {
      return function (queryTemplate, params, callback) {
        var query = queryTemplate.replace('<project_id>', keenConfig.projectId);

        var url = keenConfig.protocol + '://' + keenConfig.host + query;

        return keenClient.get(url, params, keenConfig.readKey, callback);
      };
    }])

    /**
     * Fatory providing Keen.io APIs in the Angular way
     */
    .factory('angularKeenClient', ['tbkKeen', 'tbkKeenConfig', '$q', function (Keen, KeenConfig, $q) {
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

      function Query(analysisType, properties) {
        return client.Query(analysisType, properties);
      }

      /**
       * Run query(ies) from Keen.io
       * @param queries a single query or an array of queries
       * @returns {deferred.promise|{then, catch, finally}}
       */
      function run(queries) {
        var deferred = $q.defer();
        client.run(queries, function (err, res) {
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
       * Draw the chart
       * @param query the Keen.io Query
       * @param node
       * @param config
       */
      function draw(query, node, config) {
        client.draw(query, node, config);
      }

      function collections() {
        var url = '<protocol>://<host>/projects/<project_id>/events'
          .replace('<protocol>', KeenConfig.protocol)
          .replace('<host>', KeenConfig.host)
          .replace('<project_id>', KeenConfig.projectId);

        return _sendRequest(url);
      }

      function collection(collection) {
        var url = '<protocol>://<host>/projects/<project_id>/events/<collection>'
          .replace('<protocol>', KeenConfig.protocol)
          .replace('<host>', KeenConfig.host)
          .replace('<project_id>', KeenConfig.projectId)
          .replace('<collection>', collection);

        return _sendRequest(url);
      }

      function properties(collection) {
        var url = '<protocol>://<host>/projects/<project_id>/events/<collection>/properties'
          .replace('<protocol>', KeenConfig.protocol)
          .replace('<host>', KeenConfig.host)
          .replace('<project_id>', KeenConfig.projectId)
          .replace('<collection>', collection);

        return _sendRequest(url);
      }

      function property(collection, property) {
        var url = '<protocol>://<host>/projects/<project_id>/events/<collection>/properties/<property>'
          .replace('<protocol>', KeenConfig.protocol)
          .replace('<host>', KeenConfig.host)
          .replace('<project_id>', KeenConfig.projectId)
          .replace('<collection>', collection)
          .replace('<property>', property);

        return _sendRequest(url);
      }

      function _sendRequest(url) {
        var deferred = $q.defer();

        client.get(url, null, client.masterKey(), function (err, res) {
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
        addEvent:    addEvent,
        addEvents:   addEvents,
        Query:       Query,
        run:         run,
        draw:        draw,
        collections: collections,
        collection:  collection,
        properties:  properties,
        property:    property
      };
    }]);
})(angular);
