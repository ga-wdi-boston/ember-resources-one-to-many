import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('item');
  },
  actions: {
    createItem: function(newItemData){
      var newItem = this.store.createRecord('item', newItemData);
      newItem.save();
    },
    destroyItem: function(item){
      this.store.findRecord('item', item.get('id')).then(function(itemRecord){
        itemRecord.destroyRecord();
      });
    }
  }
});
