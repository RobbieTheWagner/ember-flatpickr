import Ember from 'ember';

export default Ember.Controller.extend({
  dateValue: null,
  actions: {
    onChange(dateObject) {
      console.log('You selected: ', dateObject);
    }
  }
});
