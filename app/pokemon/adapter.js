import ApplicationAdapter from '../application/adapter';

var inflector = Ember.Inflector.inflector;
inflector.uncountable('pokemon');

export default ApplicationAdapter.extend({
  namespace: 'api'
});
