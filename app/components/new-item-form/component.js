import Ember from 'ember';

export default Ember.Component.extend({
  form: {
    name: null,
    category: null,
    effect: null
  },
  newItem: Ember.computed('form', function(){
    return {
      name: this.get('name'),
      category: this.get('category'),
      effect: this.get('effect')
    };
  }),
  actions: {
    createItem: function(){
      this.sendAction('routeCreateItem', this.get('newItem'));
    }
  }
});
