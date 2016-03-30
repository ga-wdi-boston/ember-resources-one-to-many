import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      pokemon: this.store.findAll('pokemon'),
      sightings: this.store.findAll('sighting')
    });
  },
  actions: {
    createSighting: function(properties, pokemonName){
      console.log('Route Action : createSighting');
      this.store.findAll('pokemon')
        .then((allPokemon) => {
          return allPokemon.find((pokemon) => pokemon.get('name') === pokemonName);
        })
        .then((pokemon) => {
          if (pokemon) {
            let newSighting = this.store.createRecord('sighting', properties);
            pokemon.get('sightings').pushObject(newSighting);
            newSighting.save().then(()=>console.log('record created'));
          }
        });
    },
    updateSighting: function(sighting, pokemonName) {
      console.log('Route Action : updateSighting');
      this.store.findAll('pokemon')
        .then((allPokemon) => {
          return allPokemon.find((pokemon) => pokemon.get('name') === pokemonName);
        })
        .then((pokemon) => {
          if (pokemon) {
            pokemon.get('sightings').pushObject(sighting);
          }
          sighting.save();
        });
    },
    destroySighting: function(sighting){
      console.log('Route Action : destroySighting');
      sighting.destroyRecord();
    }
  }
});
