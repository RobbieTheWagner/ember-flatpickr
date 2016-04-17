import Ember from 'ember';

export default Ember.Controller.extend({
  dateValue: null,
  minDate: null,
  actions: {
    onChange(dateObject) {
      console.log('You selected: ', dateObject);
    },
    onClose() {
      console.log('Flatpickr closed');
    },
    updateMin(){
      this.set('minDate', 'today');
    }
  }
});
