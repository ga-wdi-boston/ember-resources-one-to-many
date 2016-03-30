import Ember from 'ember';

export default Ember.Component.extend({
  form: {},
  actions: {
    createItem: function(){
      console.log('Component Action : createItem');
      this.sendAction('routeCreateItem', this.get('form'));
      this.set('form', {});
    }
  }
});
