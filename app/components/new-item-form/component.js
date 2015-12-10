import Ember from 'ember';

export default Ember.Component.extend({
  newItem: {
    name: null,
    category: null,
    effect: null
  },
  actions: {
    createItem: function(){
      this.sendAction('routeCreateItem', this.get('newItem'));
    }
  }
});
