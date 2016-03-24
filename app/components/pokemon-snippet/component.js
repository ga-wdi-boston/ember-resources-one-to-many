import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  twoTypes: Ember.computed('pokemon.types', function(){
    return this.get('pokemon.types').length > 1;
  }),
  actions: {
    updatePokemon: function(){
      console.log('Component Action : updatePokemon');
      this.sendAction('routeUpdatePokemon', this.get('pokemon'));
    },
    destroyPokemon: function(){
      console.log('Component Action : destroyPokemon');
      this.sendAction('routeDestroyPokemon', this.get('pokemon'));
    }
  }
});
