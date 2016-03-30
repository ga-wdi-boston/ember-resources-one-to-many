import Ember from 'ember';

export default Ember.Component.extend({
  form: {},
  sightingProperties: Ember.computed('form', function(){
    return {
      location: this.get('form.location'),
      observationTime: new Date(this.get('form.observationTime')),
      observer: this.get('form.observer')
    };
  }),
  pokemonProperties: Ember.computed('form', function(){
    return {
      pokemonName: this.get('form.pokemonName')
    };
  }),
  actions: {
    createSighting: function(){
      console.log('Component Action : createSighting');
      this.sendAction('routeCreateSighting',
          this.get('sightingProperties'),
          this.get('pokemonProperties.pokemonName'));
      this.set('form', {});
    }
  }
});
