(function() {
  describe('joli.connexion', function() {
    var test = new joliTest();

    /**
     * Set up the test conditions
     */
    var setUp = function() {
      test.clearTables();
      test.insertCity();
    };

    it('joli.Connection.lastInsertRowId()', function() {
      setUp();

      // retrieve the last inserted id
      var id = joli.connection.lastInsertRowId();
      expect(id).toBeGreaterThan(0);

      // retrieve this city from its id
      var city = models.city.findOneById(id);
      expect(city).not.toBeNull();
      expect(city.get('name')).toBe('New York');
    });
  });
})();