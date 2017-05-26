import Ember from 'ember';
const { Controller, Logger } = Ember;

export default Controller.extend({
  dateValue: null,
  defaultDate: '2080-12-27T16:16:22.585Z',
  locale: null,
  locales: ['default', 'fr', 'de', 'ru', 'uk'],
  minDate: null,
  actions: {
    onChange(selectedDates) {
      this.set('dateValue', selectedDates[0]);
      Logger.log('You selected: ', selectedDates[0]);
    },
    onClose() {
      Logger.log('Flatpickr closed');
    },
    onReady() {
      this.set('dateValue', null);
      Logger.log('onReady called');
    },
    updateMin() {
      this.set('dateValue', null);
      this.set('minDate', '2080-12-24T16:16:22.585Z');
    }
  }
});
