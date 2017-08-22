/* eslint-disable  ship-shape/avoid-leaking-state-in-components, ship-shape/closure-actions, ship-shape/no-observers, ship-shape/no-on-calls-in-components */
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import Component from '@ember/component';
import diffAttrs from 'ember-diff-attrs';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['disabled', 'placeholder', 'type'],
  date: null,
  flatpickrRef: null,

  setupComponent: on('init', function() {
    // Require that users pass a date
    assert('{{ember-flatpickr}} requires a `date` to be passed as the value for flatpickr.', this.get('date') !== undefined);

    // Require that users pass an onChange
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      const options = this.getProperties(Object.keys(this.attrs));

      // Add defaultDate, change and close handlers
      assign(options, {
        defaultDate: this.get('date'),
        onChange: this._onChange.bind(this),
        onClose: this._onClose.bind(this),
        onOpen: this._onOpen.bind(this),
        onReady: this._onReady.bind(this)
      });

      const flatpickrRef = flatpickr(this.element, options);

      if (this.get('appendDataInput')) {
        this.element.setAttribute('data-input', '');
      }
      this.set('flatpickrRef', flatpickrRef);
    });
  }),

  didReceiveAttrs: diffAttrs('date', 'locale', 'maxDate', 'minDate', function(changedAttrs, ...args) {
    this._super(...args);

    if (changedAttrs && changedAttrs.date) {
      const [oldDate, newDate] = changedAttrs.date;
      if (typeof newDate !== 'undefined' && oldDate !== newDate) {
        this.element._flatpickr.setDate(newDate);
      }
    }
    if (changedAttrs && changedAttrs.locale) {
      const [oldLocale, newLocale] = changedAttrs.locale;

      if (oldLocale !== newLocale) {
        this.element._flatpickr.destroy();
        this.setupComponent();
      }
    }

    if (changedAttrs && changedAttrs.maxDate) {
      const [oldMaxDate, newMaxDate] = changedAttrs.maxDate;

      if (oldMaxDate !== newMaxDate) {
        this.element._flatpickr.set('maxDate', newMaxDate);
      }
    }

    if (changedAttrs && changedAttrs.minDate) {
      const [oldMinDate, newMinDate] = changedAttrs.minDate;

      if (oldMinDate !== newMinDate) {
        this.element._flatpickr.set('minDate', newMinDate);
      }
    }
  }),

  willDestroyElement() {
    this.element._flatpickr.destroy();
  },

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
  }
});
