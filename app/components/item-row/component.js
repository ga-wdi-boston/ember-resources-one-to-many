import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    updateItem: function(){
      console.log('Component Action : updateItem');
      this.sendAction('routeUpdateItem', this.get('item'));
    },
    destroyItem: function(){
      console.log('Component Action : destroyItem');
      this.sendAction('routeDestroyItem', this.get('item'));
    }
  }
});
