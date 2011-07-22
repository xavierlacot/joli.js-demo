(function() {
  describe('joli.models', function() {
    var test = new joliTest();

    it('joli.models.get()', function() {
      expect(joli.models.get('city')).toBe(models.city);
      expect(joli.models.get('city')).not.toBe(models.human);
    });

    it('joli.models.has()', function() {
      expect(joli.models.has('city')).toBeTruthy();
      expect(joli.models.has('inexistant_model')).toBeFalsy();
    });
  });
})();