import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  nationalPokeNum: DS.attr('number'),
  name: DS.attr('string'),
  typeOne: DS.attr('string'),
  typeTwo: DS.attr('string'),
  types: Ember.computed.collect('typeOne', 'typeTwo'),
  generation: DS.attr('number'),
  totalPoints: DS.attr('number'),
  baseHp: DS.attr('number'),
  baseAttack: DS.attr('number'),
  baseDefense: DS.attr('number'),
  baseSpAttack: DS.attr('number'),
  baseSpDefense: DS.attr('number'),
  baseSpeed: DS.attr('number')
});
