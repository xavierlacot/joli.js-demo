var joli, joli2;

(function() {
  // load joli library using Ti.include()
  Ti.include('/lib/vendor/joli.js/joli.js');
  joli.connection = new joli.Connection('joli-js-demo');

  // load joli library using Ti.include()
  joli2 = require('lib/vendor/joli.js/joli').connect('joli-js-demo-2');
  
  // load the models definition file
  Ti.include('/lib/model/models.js');

  // load jasmine library and adapter
  Ti.include('/lib/vendor/jasmine/jasmine-1.0.2.js');
  Ti.include('/lib/vendor/jasmine/jasmine-titanium.js');

  // initialize the model
  joli.models.initialize();
  joli2.models.initialize();

  // load test facility functions
  Ti.include('/test/main.js');

  // load all the tests
  Ti.include('/test/joli.js');
  Ti.include('/test/connection.js');
  Ti.include('/test/migration.js');
  Ti.include('/test/model.js');
  Ti.include('/test/models.js');
  Ti.include('/test/query.js');
  Ti.include('/test/record.js');

  // execute the tests
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
  jasmine.getEnv().execute();
})();