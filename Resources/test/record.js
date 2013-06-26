(function() {
  describe('joli.record', function() {
    var test = new joliTest();

    /**
     * Set up the test conditions
     */
    var setUp = function() {
      test.clearTables();
    };

    it('joli.record.save()', function() {
      setUp();
      test.insertCities();
      expect(models.city.count()).toBe(2);

      // on object saved for the first time gets his primary key immediately available
      var berlin = models.city.newRecord({
        name:        'Berlin',
        description: 'A nice place to live'
      })
      berlin.save();
      expect(berlin.get('id')).toBeGreaterThan(0);
    });

    it('joli.record.get()', function() {
      test.createHumans();
      expect(test.sarah.get('first_name')).toBe('Sarah');
      expect(test.john.get('first_name')).toBe('John');
    });

    it ('joli.record.isChanged()', function() {
      expect(test.sarah.isChanged()).toBeFalsy();
      expect(test.john.isChanged()).toBeFalsy();

      // change a record and test its isChanged() method again
      test.sarah.set('last_name', 'Married');
      expect(test.sarah.isChanged()).toBeTruthy();
      test.sarah.save();
      expect(test.sarah.isChanged()).toBeFalsy();

      // grab a record from the database and check its isChanged() method
      var sarah = models.human.findOneBy('first_name', 'Sarah');
      expect(sarah.isChanged()).toBeFalsy();

      sarah.fromArray({
        id: sarah.get('id'),
        city_id: sarah.get('city_id'),
        first_name: 'Sarah',
        last_name: 'Michel'
      });
      expect(sarah.isChanged()).toBeTruthy();

      sarah.fromArray({
        id: sarah.get('id'),
        city_id: sarah.get('city_id'),
        first_name: 'Sarah',
        last_name: 'Married'
      });
      expect(sarah.isChanged()).toBeFalsy();
    });

    it('joli.record custom methods', function() {
      expect(test.sarah.getCityName()).toBe('New York');
      expect(test.john.getCityName()).toBe('Paris');
    });

    it('update a persisted object', function() {
      test.sarah.move('Paris');

      // check the id that the in-memory object is the good one
      var paris_id = models.city.findOneBy('name', 'Paris').get('id');
      expect(test.sarah.city_id).toBe(paris_id);

      // check that the record has not been updated in database, but return the right thing using getCityName()
      expect(test.sarah.getCityName()).toBe('Paris');
      expect(models.human.findOneById(test.sarah.id).getCityName()).toBe('New York');

      // persist the record, then check that the id is the good one both in database and in memory
      test.sarah.save();
      expect(test.sarah.city_id).toBe(paris_id);
      expect(test.sarah.getCityName()).toBe('Paris');
    });

    it('joli.record.set()', function() {
      test.john.set('last_name', 'Smith');
      expect(test.john.get('last_name')).toBe('Smith');
    });

    it('joli.record.toArray()', function() {
      var johnArray = test.john.toArray();
      expect(johnArray.last_name).toBe('Smith');
      expect(johnArray.save).toBeUndefined();

      var count = 0;
      joli.each(johnArray, function(value, key) {
        count++;
      });
      expect(count).toEqual(4);
    });
  });
})();
