/* eslint-disable  ship-shape/avoid-leaking-state-in-components, ship-shape/closure-actions, ship-shape/no-observers, ship-shape/no-on-calls-in-components */
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import Component from '@ember/component';
import diffAttrs from 'ember-diff-attrs';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['placeholder', 'type'],
  date: null,
  flatpickrRef: null,

  setupComponent: on('init', function() {
    // Require that users pass a date
    assert('{{ember-flatpickr}} requires a `date` to be passed as the value for flatpickr.', this.get('date') !== undefined);

    // Require that users pass an onChange
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      const fastboot = getOwner(this).lookup('service:fastboot');
      if(fastboot && fastboot.isFastBoot){ return; }
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

      this._setDisabled(this.get('disabled'));

      this.set('flatpickrRef', flatpickrRef);
    });
  }),

  didReceiveAttrs: diffAttrs('date', 'disabled', 'locale', 'maxDate', 'minDate', function(changedAttrs, ...args) {
    this._super(...args);

    this._applyChangeOnDate(changedAttrs);
    this._applyChangeOnDisabled(changedAttrs);
    this._applyChangeOnLocale(changedAttrs);
    this._applyChangeOnMaxMinDate(changedAttrs, 'maxDate');
    this._applyChangeOnMaxMinDate(changedAttrs, 'minDate');

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
  },

  /**
   * Set disabled for the correct input, handling altInput weirdness
   * @param {boolean} disabled Disabled or not
   * @private
   */
  _setDisabled(disabled) {
    if (this.get('altInput')) {
      this.element.nextSibling.disabled = disabled;
    } else {
      this.element.disabled = disabled;
    }
  },

  /**
   * Apply changes on Date
   * @param {object} changedAttrs
   * @private
   */
  _applyChangeOnDate(changedAttrs){
    let newDate = this._attributeHasChanged(changedAttrs, 'date');
    if (newDate){
      this.element._flatpickr.setDate(newDate);
    }
  },

  /**
   * Apply changes on disable
   * @param {object} changedAttrs
   * @private
   */
  _applyChangeOnDisabled(changedAttrs){
    let newDisabled = this._attributeHasChanged(changedAttrs, 'disabled');
    if (typeof newDisabled === 'boolean'){
      this._setDisabled(newDisabled);
    }
  },

  /**
   * Apply changes on Locale
   * @param {object} changedAttrs
   * @private
   */
  _applyChangeOnLocale(changedAttrs){
    let newLocale = this._attributeHasChanged(changedAttrs, 'locale');
    if (newLocale){
      this.element._flatpickr.destroy();
      this.setupComponent();
    }
  },

  /**
   * Apply changes on Max and Min Date
   * @param {object} changedAttrs
   * @private
   */
  _applyChangeOnMaxMinDate(changedAttrs, attribute){
    let newMaxMinDate = this._attributeHasChanged(changedAttrs, attribute);
    if (newMaxMinDate) {
      this.element._flatpickr.set(attribute, newMaxMinDate);
    }
  },

  /**
   * Check if the attribute has change, and return false or the new changed attribute
   * @param {object} changedAttrs 
  * @param {string} attribute * the key to search for changes
   * @private
   */
  _attributeHasChanged(changedAttrs, attribute) {
    if (changedAttrs && changedAttrs[attribute]) {
      const [oldAttribute, newAttribute] = changedAttrs[attribute];
      if (typeof newAttribute !== 'undefined' && oldAttribute !== newAttribute) {
        return newAttribute;
      } else {
        return false;
      }
    }
  },

});
