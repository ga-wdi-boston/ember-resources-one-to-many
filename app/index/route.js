import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {
      generations: this.store.findAll('generation'),
      pokemon: this.store.findAll('pokemon'),
      regions: this.store.findAll('region'),
      types: this.store.findAll('type')
    };
  }
});
