import Ember from 'ember';
const { assert, observer, on, run, TextField } = Ember;

export default TextField.extend({
  attributeBindings: ['placeholder', 'value'],
  // Flatpickr options
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
  time_24hr: false, // eslint-disable-line camelcase
  value: null,
  maxDateUpdated: observer('maxDate', function() {
    this.get('flatpickrRef').set('maxDate', this.get('maxDate'));
  }),
  minDateUpdated: observer('minDate', function() {
    this.get('flatpickrRef').set('minDate', this.get('minDate'));
  }),
  /**
   * When the date is changed, update the value and send 'onChange' action
   * @param dateObject The selected date
   * @param dateString The string representation of the date, formatted by dateFormat
   * @private
   */
  _onChange(dateObject, dateString) {
    if (typeof dateObject !== 'undefined') {
      this.sendAction('onChange', dateObject, dateString);
    }
  },
  /**
   * When the flatpickr is closed, fire the 'onClose' action
   * @private
   */
  _onClose() {
    this.sendAction('onClose');
  },
  setupComponent: on('init', function() {
    // Require that users pass an onChange now
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      let flatpickrRef = flatpickr(`#${this.elementId}`, {
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
        onChange: this._onChange.bind(this),
        onClose: this._onClose.bind(this),
        parseDate: this.get('parseDate'),
        shorthandCurrentMonth: this.get('shorthandCurrentMonth'),
        timeFormat: this.get('timeFormat'),
        time_24hr: this.get('time_24hr'), // eslint-disable-line camelcase
        value: this.get('value')
      });
      if (this.get('appendDataInput')) {
        this.$().attr('data-input', '');
      }
      this.set('flatpickrRef', flatpickrRef);
    });
  })
});
