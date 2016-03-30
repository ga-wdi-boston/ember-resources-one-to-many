import DS from 'ember-data';

export default DS.Model.extend({
  observationTime: DS.attr('date'),
  location: DS.attr('string'),
  observer: DS.attr('string'),

  pokemon: DS.belongsTo('pokemon', {async: true})
});
