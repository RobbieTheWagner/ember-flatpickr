/* eslint-disable  ship-shape/closure-actions, ship-shape/no-observers, ship-shape/no-on-calls-in-components, ship-shape/avoid-leaking-state-in-components, ship-shape/order-in-components */
import { assert } from 'ember-metal/utils';
import { assign } from 'ember-platform';
import observer from 'ember-metal/observer';
import on from 'ember-evented/on';
import run from 'ember-runloop';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['placeholder'],
  // Flatpickr options
  allowInput: false,
  altFormat: 'F j, Y',
  altInput: false,
  altInputClass: '',
  clickOpens: true,
  dateFormat: 'Y-m-d',
  defaultDate: null,
  disable: [],
  disableMobile: false,
  enable: [],
  enableSeconds: false,
  enableTime: false,
  flatpickrRef: null,
  hourIncrement: 1,
  inline: false,
  locale: 'default',
  maxDate: null,
  minDate: null,
  minuteIncrement: 5,
  mode: 'single',
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
  localeUpdated: observer('locale', function() {
    this.get('flatpickrRef').destroy();
    this.setupComponent();
  }),
  maxDateUpdated: observer('maxDate', function() {
    this.get('flatpickrRef').set('maxDate', this.get('maxDate'));
  }),
  minDateUpdated: observer('minDate', function() {
    this.get('flatpickrRef').set('minDate', this.get('minDate'));
  }),
  /**
   * When the date is changed, update the value and send 'onChange' action
   * @param selectedDates The array of selected dates
   * @param dateStr The string representation of the date, formatted by dateFormat
   * @param instance The flatpickr instance
   * @private
   */
  _onChange(selectedDates, dateStr, instance) {
    this.sendAction('onChange', selectedDates, dateStr, instance);
  },
  /**
   * When the flatpickr is closed, fire the 'onClose' action
   * @param selectedDates The array of selected dates
   * @param dateStr The string representation of the date, formatted by dateFormat
   * @param instance The flatpickr instance
   * @private
   */
  _onClose(selectedDates, dateStr, instance) {
    this.sendAction('onClose', selectedDates, dateStr, instance);
  },
  /**
   * When the flatpickr is opened, fire the 'onOpen' action
   * @param selectedDates The array of selected dates
   * @param dateStr The string representation of the date, formatted by dateFormat
   * @param instance The flatpickr instance
   * @private
   */
  _onOpen(selectedDates, dateStr, instance) {
    this.sendAction('onOpen', selectedDates, dateStr, instance);
  },
  /**
   * When the flatpickr is ready, fire the 'onReady' action
   * @param selectedDates The array of selected dates
   * @param dateStr The string representation of the date, formatted by dateFormat
   * @param instance The flatpickr instance
   * @private
   */
  _onReady(selectedDates, dateStr, instance) {
    this.sendAction('onReady', selectedDates, dateStr, instance);
  },
  setupComponent: on('init', function() {
    // Require that users pass an onChange now
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      const options = this.getProperties([
        'allowInput',
        'altFormat',
        'altInput',
        'altInputClass',
        'clickOpens',
        'dateFormat',
        'defaultDate',
        'disable',
        'disableMobile',
        'enable',
        'enableSeconds',
        'enableTime',
        'hourIncrement',
        'inline',
        'locale',
        'maxDate',
        'minDate',
        'minuteIncrement',
        'mode',
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
        onOpen: this._onOpen.bind(this),
        onReady: this._onReady.bind(this)
      });

      const flatpickrRef = new Flatpickr(this.element, options);

      if (this.get('appendDataInput')) {
        this.$().attr('data-input', '');
      }
      this.set('flatpickrRef', flatpickrRef);
    });
  }),
  didReceiveAttrs() {
    this._super(...arguments);

    const value = this.get('value');
    const ref = this.get('flatpickrRef');

    if (ref) {
      this.get('flatpickrRef').setDate(value);
    }
  },
  willDestroyElement() {
    this.get('flatpickrRef').destroy();
  }
});
