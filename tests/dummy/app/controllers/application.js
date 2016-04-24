import Ember from 'ember';
const {Controller} = Ember;

export default Controller.extend({
  dateValue: null,
  defaultDate: '2016-12-27T16:16:22.585Z',
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
