var joliTest = function() {
  var john, sarah, newYork, paris;
};

joliTest.prototype = {
  /**
   * clear model tables
   */
  clearTables: function() {
    models.city.truncate();
    models.country.truncate();
    models.human.truncate();
    
    // also clear the second database
    joli2.models.get('city').truncate();
    joli2.models.get('country').truncate();
    joli2.models.get('human').truncate();
  },

  /**
   * Insert some human records
   */
  createHumans: function() {
    // create a "human" record (not persisted)
    this.john = models.human.newRecord({
      first_name: 'John',
      last_name: 'Doe'
    });
    // move him to New York
    this.john.move('Paris');

    // create an other "human" record (persisted)
    this.sarah = models.human.newRecord({
      first_name: 'Sarah',
      last_name: 'Sure'
    });
    this.sarah.move('New York');
    this.sarah.save();
  },

  /**
   * Insert some human records in the joli2 database
   */
  createHumansInJoli2: function() {
    // create a "human" record (persisted)
    this.john2 = joli2.models.get('human').newRecord({
      first_name: 'John',
      last_name: 'Doe'
    });
    this.john2.save();

    // create an other "human" record (persisted)
    this.sarah2 = joli2.models.get('human').newRecord({
      first_name: 'Sarah',
      last_name: 'Sure'
    });
    this.sarah2.save();
  },

  /**
   * Insert many human records
   */
  createManyItems: function() {
    var cityIds = [];
    var cities = [
      { name: 'Berlin' },
      { name: 'Copenhagen' },
      { name: 'Geneva' },
      { name: 'Los Angeles' },
      { name: 'Montreal' },
      { name: 'New York' },
      { name: 'Oslo' },
      { name: 'Paris' }
    ];

    joli.each(cities, function(properties, key) {
      var city = models.city.newRecord(properties);
      city.save();
      cityIds[key] = city.id;
    });

    var i = 0;

    while (i < 30) {
      var key = Math.floor(cities.length * Math.random());
      var city_id = cityIds[key];
      var human = models.human.newRecord({
        first_name: 'FirstName_' + i,
        last_name: 'Name_' + i,
        city_id: city_id
      });
      human.save();
      i++;
    }
  },

  insertCity: function() {
    // insert a new city
    new joli.query().insertInto('city').values({
      name:        'New York',
      description: 'A big Apple'
    }).execute();
  },

  /**
   * Insert some cities
   */
  insertCities: function() {
    this.newYork = models.city.newRecord({
      name:        'New York',
      description: 'A big Apple'
    });
    this.newYork.save();
    this.paris = models.city.newRecord({
      name:        'Paris',
      description: 'Cheese and Baguette'
    });
    this.paris.save();
  }
};