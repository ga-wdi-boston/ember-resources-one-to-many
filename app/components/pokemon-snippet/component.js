import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  twoTypes: Ember.computed('pokemon.types', function(){
    return this.get('pokemon.types').get('length') > 1;
  }),
  isEditable: false,
  actions: {
    updatePokemon: function(){
      console.log('Component Action : updatePokemon');
      this.sendAction('routeUpdatePokemon', this.get('pokemon'));
      this.set('isEditable', false);
    },
    destroyPokemon: function(){
      console.log('Component Action : destroyPokemon');
      this.sendAction('routeDestroyPokemon', this.get('pokemon'));
    }
  },
  doubleClick: function(){
    this.toggleProperty('isEditable');
  }
});
