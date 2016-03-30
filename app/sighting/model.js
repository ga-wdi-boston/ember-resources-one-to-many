import DS from 'ember-data';

export default DS.Model.extend({
  observationTime: DS.attr('date'),
  location: DS.attr('string'),
  observer: DS.attr('string'),
});
