/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { run } from '@ember/runloop';

export default Controller.extend({
  dateValue: null,
  defaultDate: '2080-12-27T16:16:22.585Z',
  classString: `docs-transition
    focus:docs-outline-0
    docs-border docs-border-transparent
    focus:docs-bg-white
    focus:docs-border-grey-light
    docs-placeholder-grey-darkest
    docs-rounded
    docs-bg-grey-lighter
    docs-py-2 docs-pr-4
    docs-pl-10
    docs-block
    docs-w-2/3
    docs-appearance-none
    docs-leading-normal
    docs-ds-input`,
  locale: null,
  locales: ['default', 'fr', 'de', 'ru', 'uk'],
  minDate: null,
  timeValue: null,
  actions: {
    clearDate() {
      this.set('dateValue', null);
    },
    clearTime() {
      this.set('timeValue', null);
    },
    onChange(selectedDates) {
      run.next(() => {
        this.set('dateValue', selectedDates[0]);
        console.log('You selected: ', selectedDates[0]);
      });
    },
    onChangeTime(selectedDates) {
      run.next(() => {
        this.set('timeValue', selectedDates[0]);
        console.log('You selected: ', selectedDates[0]);
      });
    },
    onClose() {
      console.log('Flatpickr closed');
    },
    onCloseTime() {
      console.log('Time Flatpickr closed');
    },
    onReady() {
      this.set('dateValue', null);
      console.log('onReady called');
    },
    onReadyTime() {
      this.set('timeValue', null);
      console.log('onReadyTime called');
    },
    updateMin() {
      run.next(() => {
        this.set('dateValue', null);
        this.set('minDate', '2080-12-24T16:16:22.585Z');
      });
    }
  }
});
