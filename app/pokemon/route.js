import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {
      pokemon: this.store.findAll('pokemon'),
      sightings: this.store.findAll('sighting')
    };
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
      pokemon.get('sightings').forEach((sighting) => sighting.destroyRecord());
      pokemon.destroyRecord();
    }
  }
});
