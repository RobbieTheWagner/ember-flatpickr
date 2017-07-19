import Controller from '@ember/controller';
import { run } from '@ember/runloop';

export default Controller.extend({
  dateValue: null,
  defaultDate: '2080-12-27T16:16:22.585Z',
  locale: null,
  locales: ['default', 'fr', 'de', 'ru', 'uk'],
  minDate: null,
  actions: {
    clearDate() {
      this.set('dateValue', null);
    },
    onChange(selectedDates) {
      run.next(() => {
        this.set('dateValue', selectedDates[0]);
        console.log('You selected: ', selectedDates[0]);
      });
    },
    onClose() {
      console.log('Flatpickr closed');
    },
    onReady() {
      this.set('dateValue', null);
      console.log('onReady called');
    },
    updateMin() {
      run.next(() => {
        this.set('dateValue', null);
        this.set('minDate', '2080-12-24T16:16:22.585Z');
      });
    }
  }
});
