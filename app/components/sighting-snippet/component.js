import Ember from 'ember';

export default Ember.Component.extend({
  isEditable: false,
  doubleClick: function(){
    this.toggleProperty('isEditable');
  },
  actions: {
    updateSighting: function(){
      console.log('Component Action : updateSighting');
      this.set('isEditable', false);
      this.sendAction('routeUpdateSighting', this.get('sighting'));
    },
    destroySighting: function(){
      console.log('Component Action : destroySighting');
      this.sendAction('routeDestroySighting', this.get('sighting'));
    }
  }
});
