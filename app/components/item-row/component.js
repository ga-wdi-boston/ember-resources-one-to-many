import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  isEditable: false,
  actions: {
    destroyItem: function(){
      this.sendAction('routeDestroyItem', this.get('item'));
    }
  },
  doubleClick: function(){
    this.toggleProperty('isEditable');
  }
});
