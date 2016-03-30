import Ember from 'ember';

export default Ember.Component.extend({
  form: {},
  actions: {
    createSighting: function(){
      console.log('Component Action : createSighting');
      this.sendAction('routeCreateSighting', this.get('form'));
      this.set('form', {});
    }
  }

});
