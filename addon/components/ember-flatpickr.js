import Ember from 'ember';
import assign from 'ember-assign-polyfill';
const { assert, observer, on, run, TextField } = Ember;

export default TextField.extend({
  attributeBindings: ['placeholder', 'value'],
  // Flatpickr options
  allowInput: false,
  altFormat: 'F j, Y',
  altInput: false,
  altInputClass: '',
  clickOpens: true,
  dateFormat: 'Y-m-d',
  defaultDate: null,
  disable: [],
  enableSeconds: false,
  enableTime: false,
  flatpickrRef: null,
  hourIncrement: 1,
  inline: false,
  maxDate: null,
  minDate: null,
  minuteIncrement: 5,
  nextArrow: '>',
  noCalendar: false,
  parseDate: false,
  prevArrow: '<',
  shorthandCurrentMonth: false,
  static: false,
  timeFormat: 'H:i',
  time_24hr: false, // eslint-disable-line camelcase
  utc: false,
  value: null,
  weekNumbers: false,
  wrap: false,
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
      this.sendAction('onChange', dateObject[0], dateString);
    }
  },
  /**
   * When the flatpickr is closed, fire the 'onClose' action
   * @private
   */
  _onClose() {
    this.sendAction('onClose');
  },
  /**
   * When the flatpickr is opened, fire the 'onOpen' action
   * @private
   */
  _onOpen() {
    this.sendAction('onOpen');
  },
  setupComponent: on('init', function() {
    // Require that users pass an onChange now
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      let options = this.getProperties([
        'allowInput',
        'altFormat',
        'altInput',
        'altInputClass',
        'clickOpens',
        'dateFormat',
        'defaultDate',
        'disable',
        'enableSeconds',
        'enableTime',
        'hourIncrement',
        'inline',
        'maxDate',
        'minDate',
        'minuteIncrement',
        'nextArrow',
        'noCalendar',
        'parseDate',
        'prevArrow',
        'shorthandCurrentMonth',
        'static',
        'timeFormat',
        'time_24hr',
        'utc',
        'value',
        'weekNumbers',
        'wrap'
      ]);

      // Add change and close handlers
      assign(options, {
        onChange: this._onChange.bind(this),
        onClose: this._onClose.bind(this),
        onOpen: this._onOpen.bind(this)
      });

      let flatpickrRef = new Flatpickr(this.element, options);

      if (this.get('appendDataInput')) {
        this.$().attr('data-input', '');
      }
      this.set('flatpickrRef', flatpickrRef);
    });
  }),
  didReceiveAttrs() {
    this._super(...arguments);

    let value = this.get('value');
    let ref = this.get('flatpickrRef');

    if (ref) {
      this.get('flatpickrRef').setDate(value);
    }
  },
  willDestroyElement() {
    this.get('flatpickrRef').destroy();
  }
});
