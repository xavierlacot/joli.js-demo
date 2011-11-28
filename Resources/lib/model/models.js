var models = (function() {
  var m = {};

  m.human = new joli.model({
    table:    'human',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      city_id:            'INTEGER',
      first_name:         'TEXT',
      last_name:          'TEXT'
    },
    methods: {
      countIn:  function(cityName) {
        // search for the city id
        var city = joli.models.get('city').findOneBy('name', cityName);

        if (!city) {
          throw 'Could not find a city with the name ' + cityName + '!';
        } else {
          return this.count({
            where: {
              'city_id = ?': city.id
            }
          });
        }
      }
    },
    objectMethods: {
      move:  function(newCityName) {
        // search for the city id
        var city = joli.models.get('city').findOneBy('name', newCityName);

        if (!city) {
          throw 'Could not find a city with the name ' + newCityName + '!';
        } else {
          this.set('city_id', city.id);
        }
      },
      getCityName: function() {
        // search for the city id
        var city = joli.models.get('city').findOneById(this.city_id);

        if (!city) {
          throw 'Could not find a city for this person!';
        } else {
          return city.name;
        }
      }
    }
  });

  m.city = new joli.model({
    table:    'city',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      country_id:         'INTEGER',
      name:               'TEXT',
      description:        'TEXT'
    }
  });

  m.country = new joli.model({
    table:    'country',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name:               'TEXT'
    }
  });

  return m;
})();



/**
 * These tables are created in the joli2 database.
 * We do not name this bag of models, so the only way to access them will be
 * joli2.models.get()
 */
(function() {
  var m = {};

  m.human = new joli2.model({
    table:    'human',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      city_id:            'INTEGER',
      first_name:         'TEXT',
      last_name:          'TEXT'
    }
  });

  m.city = new joli2.model({
    table:    'city',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      country_id:         'INTEGER',
      name:               'TEXT',
      description:        'TEXT'
    }
  });

  m.country = new joli2.model({
    table:    'country',
    columns:  {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name:               'TEXT'
    }
  });

  return m;
})();