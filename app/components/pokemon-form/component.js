import Ember from 'ember';

export default Ember.Component.extend({
  form: {},
  actions: {
    createPokemon: function(){
      console.log('Component Action : createPokemon');
      this.sendAction('routeCreatePokemon', this.get('form'));
      this.set('form', {});
    }
  }
});
