import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('pokemon');
  },
  actions: {
    createPokemon: function(newPokemon){
      this.store.createRecord('pokemon', newPokemon).save();
    },
    destroyPokemon: function(pokemon){
      this.store.findRecord('pokemon', pokemon.get('id')).then(function(pokemonRecord){
        pokemonRecord.destroyRecord();
        console.log('record destroyed');
      });
    }
  }
});
