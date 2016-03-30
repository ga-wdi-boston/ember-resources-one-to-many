import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sighting-snippet', 'Integration | Component | sighting snippet', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sighting-snippet}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sighting-snippet}}
      template block text
    {{/sighting-snippet}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
