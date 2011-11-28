(function() {
  describe('joli.model', function() {
    var test = new joliTest();

    /**
     * Set up the test conditions
     */
    var setUp = function() {
      test.clearTables();
    };

    it('joli.model.truncate()', function() {
      setUp();

      models.city.truncate();
      models.country.truncate();
      models.human.truncate();

      expect(models.city.count()).toBe(0);
      expect(models.country.count()).toBe(0);
      expect(models.human.count()).toBe(0);
    });

    it('joli.model.all()', function() {
      test.insertCities();
      var cities = models.city.all();

      expect(cities.length).toBe(2);
      expect(cities[0].get('name')).toBe('New York');
      expect(cities[1].get('name')).toBe('Paris');
    });

    it('joli.model.count()', function() {
      test.createHumans();
      test.createHumansInJoli2();
      expect(models.human.count()).toBe(1);
      
      // the same test, but accessing the model through joli.models.get()
      expect(joli.models.get('human').count()).toBe(1);
      expect(joli2.models.get('human').count()).toBe(2);
    });

    it('joli.model.deleteRecords()', function() {
      models.human.deleteRecords(test.sarah.get('id'));
      expect(models.human.count()).toBe(0);

      test.createHumans();
      test.john.save();
      expect(models.human.count()).toBe(2);

      models.human.deleteRecords([
        test.john.get('id'),
        test.sarah.get('id')
      ]);

      expect(models.human.count()).toBe(0);
    });

    it('joli.model.exists()', function() {
      expect(models.human.exists(test.sarah.get('id'))).toBeFalsy();

      test.createHumans();
      expect(models.human.exists(test.sarah.get('id'))).toBeTruthy();
    });

    it('joli.model.findBy()', function() {
      test.clearTables();
      test.createManyItems();

      var paris_id = models.city.findOneBy('name', 'Paris').get('id');
      var livingInParis = models.human.findBy('city_id', paris_id);

      joli.each(livingInParis, function(item, key) {
        expect(item.city_id).toBe(paris_id);
      });
    });

    it('joli.model.findOneBy()', function() {
      expect(models.city.findOneBy('name', 'Paris')).not.toBeNull();
      expect(models.city.findOneBy('name', 'InexistantCity')).toBeFalsy();
    });

    it('joli.model.getColumns()', function() {
      expect(models.city.getColumns()).toEqual({
        id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
        country_id:         'INTEGER',
        name:               'TEXT',
        description:        'TEXT'
      });
    });

    it('model methods only for persisted items', function() {
      test.clearTables();
      test.insertCities();
      test.createHumans();
      expect(models.human.countIn('Paris')).toBe(0);
      expect(models.human.countIn('New York')).toBe(1);
    });
  });
})();