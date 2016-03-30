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
      this.store.createRecord('sighting', properties)
        .save().then(()=>console.log('record created'));
    },
    updateSighting: function(sighting) {
      console.log('Route Action : updateSighting');
      sighting.save();
    },
    destroySighting: function(sighting){
      console.log('Route Action : destroySighting');
      sighting.destroyRecord()
    }
  }
});
