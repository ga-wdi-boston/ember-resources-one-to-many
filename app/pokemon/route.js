import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('pokemon');
  },
  actions: {
    createPokemon: function(newPokemonData){
      var newPokemon = this.store.createRecord('pokemon', newPokemonData);
      newPokemon.save();
    },
    destroyPokemon: function(pokemon){
      this.store.findRecord('pokemon', pokemon.get('id')).then(function(pokemonRecord){
        pokemonRecord.destroyRecord();
      });
    }
  }
});
