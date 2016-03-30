import Ember from 'ember';

export default Ember.Component.extend({
  isEditable: false,
  doubleClick: function(){
    this.toggleProperty('isEditable');
  },
  pokemonName: Ember.computed.oneWay('sighting.pokemon.name'),
  actions: {
    updateSighting: function(){
      console.log('Component Action : updateSighting');
      this.set('isEditable', false);
      this.sendAction('routeUpdateSighting',
        this.get('sighting'),
        this.get('pokemonName'));
    },
    destroySighting: function(){
      console.log('Component Action : destroySighting');
      this.sendAction('routeDestroySighting', this.get('sighting'));
    }
  }
});
