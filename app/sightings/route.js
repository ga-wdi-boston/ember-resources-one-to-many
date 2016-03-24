import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {
      pokemon: this.store.findAll('pokemon'),
      sightings: this.store.findAll('sighting')
    };
  },
  actions: {
    createSighting: function(properties){
      console.log('Route Action : createSighting');
    },
    updateSighting: function(sighting) {
      console.log('Route Action : updateSighting');
    },
    destroySighting: function(sighting){
      console.log('Route Action : destroySighting');
    }
  }
});
