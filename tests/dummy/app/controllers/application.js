import Ember from 'ember';
const { Controller, Logger } = Ember;

export default Controller.extend({
  dateValue: null,
  defaultDate: '2016-12-27T16:16:22.585Z',
  minDate: null,
  actions: {
    onChange(dateObject, dateString) {
      this.set('dateValue', dateString);
      Logger.log('You selected: ', dateObject);
    },
    onClose() {
      Logger.log('Flatpickr closed');
    },
    updateMin() {
      this.set('minDate', 'today');
    }
  }
});
