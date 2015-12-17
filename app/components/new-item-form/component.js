import Ember from 'ember';

export default Ember.Component.extend({
  form: {
    name: null,
    category: null,
    effect: null
  },
  newItemData: Ember.computed('form', function(){
    return {
      name: this.get('form.name'),
      category: this.get('form.category'),
      effect: this.get('form.effect')
    };
  }),
  actions: {
    createItem: function(){
      this.sendAction('routeCreateItem', this.get('newItemData'));
    }
  }
});
