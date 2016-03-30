import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('item');
  },
  actions: {
    createItem: function(properties){
      console.log('Route Action : createItem');
      this.store.createRecord('item', properties)
        .save().then(()=>console.log('record created'));
    },
    updateItem: function(item) {
      console.log('Route Action : updateItem');
      item.save();
    },
    destroyItem: function(id){
      console.log('Route Action : destroyItem');
      this.store.findRecord('item', id).then((item) => {
        this.store.deleteRecord(item);
        console.log(`record ${id} destroyed`);
      });
    }
  }
});
