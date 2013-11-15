(function() {
  describe('joli.query', function() {
    var test = new joliTest();
    var q;

    it('joli.query.count()', function() {
      q = new joli.query().count().from('human');
      expect(q.getQuery()).toBe('select count(*) as total from human');
    });

    it('joli.query.destroy()', function() {
      q = new joli.query().destroy().from('human');
      expect(q.getQuery()).toBe('delete from human');
    });

    it('joli.query.from()', function() {
      q = new joli.query().select().from('human');
      expect(q.getQuery()).toBe('select * from human');
    });

    it('joli.query.groupBy()', function() {
      // check beahvior with column names as a string
      q = new joli.query().select('city_id, count(*) as total').from('human').groupBy('city_id');
      expect(q.getQuery()).toBe('select city_id, count(*) as total from human group by city_id');

      q = new joli.query().select('city_id, count(*) as total').from('human').groupBy('city_id, first_name');
      expect(q.getQuery()).toBe('select city_id, count(*) as total from human group by city_id, first_name');

      // check beahvior with an array of column names
      q = new joli.query().select('city_id, count(*) as total').from('human').groupBy(['city_id', 'first_name']);
      expect(q.getQuery()).toBe('select city_id, count(*) as total from human group by city_id, first_name');
    });

    it('joli.query.having()', function() {
      q = new joli.query().select('count(human.id) as nb_humans').from('human').where('first_name = ?', 'michel').groupBy('city_id').having('nb_humans > ?', 1);
      expect(q.getQuery()).toBe('select count(human.id) as nb_humans from human where first_name = "michel" group by city_id having nb_humans > "1"');

      q = new joli.query().select('count(human.id) as nb_humans').from('human').groupBy('city_id').having('nb_humans > ?', 1);
      expect(q.getQuery()).toBe('select count(human.id) as nb_humans from human group by city_id having nb_humans > "1"');
    });

    it('joli.query.insertInto()', function() {
      q = new joli.query().insertInto('human').values({
        first_name: 'John',
        last_name: 'Doe'
      });
      expect(q.getQuery()).toBe('insert into human (first_name, last_name) values (\'John\', \'Doe\')');
    });

    it('joli.query.insertReplace()', function() {
      q = new joli.query().insertReplace('human').values({
        first_name: 'John',
        last_name: 'Doe'
      });
      expect(q.getQuery()).toBe('insert or replace into human (first_name, last_name) values (\'John\', \'Doe\')');
    });

    it('joli.query.join()', function() {
      // check behavior with simple local id
      q = new joli.query().select()
        .from('human')
        .join('city', 'id', 'human.city_id');
      expect(q.getQuery()).toBe('select * from human left outer join city on city.id = human.city_id');

      // check behavior with fully qualified local id
      q = new joli.query().select()
        .from('human')
        .join('city', 'city.id', 'human.city_id');
      expect(q.getQuery()).toBe('select * from human left outer join city on city.id = human.city_id');
    });

    it('joli.query.as()', function() {
      // test without using as()
      q = new joli.query().select()
        .from('human')
        .join('city', 'id', 'human.city_id');

      // query validation
      expect(q.getQuery()).toBe('select * from human left outer join city on city.id = human.city_id');

      // recs should be for humans
      recs = q.execute();
      expect(recs.length).toBe(1);
      human = recs[0];
      expect(human.first_name).toBe('Sarah');
      expect(human.last_name).toBe('Sure');
      expect(human.city_id).toBe(models.city.findOneBy('name', 'New York').get('id'));

      // test a projection of the same query using as('city')
      q = new joli.query().select('city.*')
        .from('human')
        .join('city', 'id', 'human.city_id')
        .as('city');

      // query validation
      expect(q.getQuery()).toBe('select city.* from human left outer join city on city.id = human.city_id');

      // recs should be for cities
      recs = q.execute();
      expect(recs.length).toBe(1);
      city = recs[0];
      expect(city.name).toBe('New York');
      expect(city.id).toBe(models.city.findOneBy('name', 'New York').get('id'));
    });

    it('joli.query.limit()', function() {
      q = new joli.query().select().from('human').limit(10);
      expect(q.getQuery()).toBe('select * from human limit 10');
    });

    it('joli.query.order()', function() {
      // check behavior with a string
      q = new joli.query().select().from('human').order('first_name');
      expect(q.getQuery()).toBe('select * from human order by first_name');

      q = new joli.query().select().from('human').order('first_name, last_name');
      expect(q.getQuery()).toBe('select * from human order by first_name, last_name');

      // check behavior with an array
      q = new joli.query().select().from('human').order([
        'first_name',
        'last_name'
      ]);
      expect(q.getQuery()).toBe('select * from human order by first_name, last_name');
    });

    it('joli.query.set()', function() {
      // check behavior with a simple array
      q = new joli.query().update('human').set({ first_name: 'Jane' });
      expect(q.getQuery()).toBe('update human set first_name = \'Jane\'');

      q = new joli.query().update('human').set({ first_name: 'Jane', last_name: 'Calamity' });
      expect(q.getQuery()).toBe('update human set first_name = \'Jane\', last_name = \'Calamity\'');

      // check behavior with an expression
      var date = new Date().getTime();
      q = new joli.query().update('view_count').set({ 'nb_views = nb_views + 1': '', last_viewed: date });
      expect(q.getQuery()).toBe('update view_count set nb_views = nb_views + 1, last_viewed = ' + date);
    });

    it('joli.query.update()', function() {
      q = new joli.query().update('human');
      expect(q.getQuery()).toBe('update human set ');
    });

    it('joli.query.values()', function() {
      q = new joli.query().insertInto('human').values({
        first_name: 'John',
        last_name: 'Doe'
      });
      expect(q.getQuery()).toBe('insert into human (first_name, last_name) values (\'John\', \'Doe\')');
    });

    it('joli.query.where()', function() {
      q = new joli.query().select().from('human').where('last_name = ?', 'Doe');
      expect(q.getQuery()).toBe('select * from human where last_name = "Doe"');

      // another comparison expression
      q = new joli.query().select().from('view_count').where('nb_views > ?', 1000);
      expect(q.getQuery()).toBe('select * from view_count where nb_views > "1000"');

      // array-based single replacement
      q = new joli.query().select().from('view_count').where('nb_views > ?', [1000]);
      expect(q.getQuery()).toBe('select * from view_count where nb_views > "1000"');

      // multiple value replacements, for instance for between statements
      q = new joli.query().select().from('view_count').where('nb_views between ? and ?', [1000, 2000]);
      expect(q.getQuery()).toBe('select * from view_count where nb_views between "1000" and "2000"');

      // check that replacements stop even if there are less arguments than expected
      q = new joli.query().select().from('view_count').where('nb_views between ? and ?', [1000]);
      expect(q.getQuery()).toBe('select * from view_count where nb_views between "1000" and ?');

      // check that replacements work with 0 values
      q = new joli.query().select().from('view_count').where('nb_views between ? and ?', [1000, 0]);
      expect(q.getQuery()).toBe('select * from view_count where nb_views between "1000" and "0"');

      // check that replacements work for values after 0
      q = new joli.query().select().from('view_count').where('nb_views between ? and ? and ?', [1000, 0, 2000]);
      expect(q.getQuery()).toBe('select * from view_count where nb_views between "1000" and "0" and "2000"');

      // check with several chained calls
      q = new joli.query().select().from('human').where('last_name = ?', 'Doe').where('first_name = ?', 'John');
      expect(q.getQuery()).toBe('select * from human where last_name = "Doe" and first_name = "John"');

      // check a comparison between two model fields
      q = new joli.query().select().from('news_articles').where('updated_at > published_at');
      expect(q.getQuery()).toBe('select * from news_articles where updated_at > published_at');
    });

    it('joli.query.whereIn()', function() {
      // a simple string
      q = new joli.query().select().from('human').whereIn('last_name', '(\'Doe\', \'Smith\')');
      expect(q.getQuery()).toBe('select * from human where last_name in (\'Doe\', \'Smith\')');

      // an array of values
      q = new joli.query().select().from('human').whereIn('last_name', [ 'Doe', 'Smith' ]);
      expect(q.getQuery()).toBe('select * from human where last_name in (\'Doe\', \'Smith\')');

      // check with several chained calls
      q = new joli.query().select().from('human').where('last_name = ?', 'Doe').whereIn('first_name', [ 'John', 'Jane' ]);
      expect(q.getQuery()).toBe('select * from human where last_name = "Doe" and first_name in (\'John\', \'Jane\')');
    });

    /**
     * @TODO: add hydratation test methods
     */
  });
})();
