import Ember from 'ember';
const {Component, observer, on, run} = Ember;

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['placeholder', 'type', 'value'],
  //Flatpickr options
  altFormat: 'F j, Y',
  altInput: false,
  dateFormat: 'Y-m-d',
  defaultDate: null,
  disable: null,
  enableTime: false,
  flatpickrRef: null,
  hourIncrement: 1,
  inline: false,
  maxDate: null,
  minDate: null,
  minuteIncrement: 5,
  noCalendar: false,
  parseDate: false,
  shorthandCurrentMonth: false,
  timeFormat: 'H:i',
  time_24hr: false,
  value: null,
  maxDateUpdated: observer('maxDate', function() {
    this.get('flatpickrRef').set('maxDate', this.get('maxDate'));
  }),
  minDateUpdated: observer('minDate', function() {
    this.get('flatpickrRef').set('minDate', this.get('minDate'));
  }),
  /**
   * When the date is changed, update the value and send 'onChangeAction'
   * @param dateObject The selected date
   * @param dateString The string representation of the date, formatted by dateFormat
   */
  onChange(dateObject, dateString) {
    if (typeof dateObject !== 'undefined') {
      this.set('value', dateObject);
      this.sendAction('onChangeAction', dateObject, dateString);
    }
  },
  /**
   * When the flatpickr is closed, fire the 'onCloseAction'
   */
  onClose() {
    this.sendAction('onCloseAction');
  },
  setupComponent: on('init', function() {
    run.scheduleOnce('afterRender', this, function() {
      const flatpickrRef = flatpickr('#' + this.elementId, {
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
        noCalendar: this.get('noCalendar'),
        onChange: this.onChange.bind(this),
        onClose: this.onClose.bind(this),
        parseDate: this.get('parseDate'),
        shorthandCurrentMonth: this.get('shorthandCurrentMonth'),
        timeFormat: this.get('timeFormat'),
        time_24hr: this.get('time_24hr'),
        value: this.get('value')
      });
      if (this.get('appendDataInput')) {
        this.$().attr('data-input', '');
      }
      this.set('flatpickrRef', flatpickrRef);
    });
  })
});
