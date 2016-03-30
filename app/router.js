import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
});

Router.map(function () {
  this.route('pokemon');
  this.route('items');
  this.route('sightings');
});

export default Router;
