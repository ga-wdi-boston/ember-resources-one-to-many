import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('pokemon');
  },
  actions: {
    createPokemon: function(properties){
      console.log('Route Action : createPokemon');
      this.store.createRecord('pokemon', properties)
        .save().then(()=>console.log('record created'));
    },
    updatePokemon: function(pokemon) {
      console.log('Route Action : updatePokemon');
      pokemon.save();
    },
    destroyPokemon: function(pokemon){
      console.log('Route Action : destroyPokemon');
      pokemon.destroyRecord();
    }
  }
});
