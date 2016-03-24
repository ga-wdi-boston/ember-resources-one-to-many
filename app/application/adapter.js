import Ember from 'ember';
import ActiveModelAdapter from 'active-model-adapter';

Ember.Inflector.inflector.uncountable('pokemon');

export default ActiveModelAdapter.extend({
  host: 'http://localhost:3000'
});
