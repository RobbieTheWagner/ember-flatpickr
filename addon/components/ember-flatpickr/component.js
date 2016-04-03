import Ember from 'ember';
const {Component} = Ember;

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['placeholder', 'value'],
  //Flatpickr options
  altFormat: 'F j, Y',
  altInput: false,
  dateFormat: 'Y-m-d',
  defaultDate: null,
  disable: null,
  enableTime: false,
  hourIncrement: 1,
  inline: false,
  maxDate: null,
  minDate: null,
  minuteIncrement: 5,
  shorthandCurrentMonth: false,
  timeFormat: 'H:i',
  value: null,
  didInsertElement() {
    flatpickr('#' + this.elementId, {
      altFormat: this.get('altFormat'),
      altInput: this.get('altInput'),
      dateFormat: this.get('dateFormat'),
      defaultDate: this.get('defaultDate'),
      disable: this.get('disable'),
      enableTime: this.get('enableTime'),
      hourIncrement: this.get('hourIncrement'),
      inline: this.get('inline'),
      maxDate: this.get('maxDate'),
      minDate: this.get('minDate'),
      minuteIncrement: this.get('minuteIncrement'),
      onChange: this.get('onChange'),
      shorthandCurrentMonth: this.get('shorthandCurrentMonth'),
      timeFormat: this.get('timeFormat'),
      value: this.get('value')
    });
  }
});
