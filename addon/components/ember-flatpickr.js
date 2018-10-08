/* eslint-disable ember/closure-actions, ember/no-attrs-in-components, ember/no-on-calls-in-components */
/** @documenter yuidoc */

import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import Component from '@ember/component';
import diffAttrs from 'ember-diff-attrs';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';

/**
 * A component that wraps flatpickr
 *
 * ```hbs
 * {{ember-flatpickr}}
 * ```
 *
 * @class ember-flatpickr
 * @public
 */
export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['placeholder', 'type'],
  /**
   * The date to pass to flatpickr
   * @argument {Date|string} date
   */
  date: null,
  flatpickrRef: null,

  /**
   * Setup the component on init
   * @method setupComponent
   * @public
   */
  setupComponent: on('init', function() {
    // Require that users pass a date
    assert('{{ember-flatpickr}} requires a `date` to be passed as the value for flatpickr.', this.get('date') !== undefined);

    // Require that users pass an onChange
    assert('{{ember-flatpickr}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, function() {
      const fastboot = getOwner(this).lookup('service:fastboot');
      if (fastboot && fastboot.isFastBoot) {
        return;
      }
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

  didReceiveAttrs: diffAttrs('altFormat', 'date', 'disabled', 'locale', 'maxDate', 'minDate', function(changedAttrs, ...args) {
    this._super(...args);
    
    this._attributeHasChanged(changedAttrs, 'altFormat', (newAltFormat) => {
      this.element._flatpickr.set('altFormat', newAltFormat);
    });

    this._attributeHasChanged(changedAttrs, 'date', (newDate) => {
      if (typeof newDate !== 'undefined') {
        this.element._flatpickr.setDate(newDate);
      }
    });

    this._attributeHasChanged(changedAttrs, 'disabled', (newDisabled) => {
      if (typeof newDisabled !== 'undefined') {
        this._setDisabled(newDisabled);
      }
    });

    this._attributeHasChanged(changedAttrs, 'locale', () => {
      this.element._flatpickr.destroy();
      this.setupComponent();
    });

    this._attributeHasChanged(changedAttrs, 'maxDate', (newMaxDate) => {
      this.element._flatpickr.set('maxDate', newMaxDate);
    });

    this._attributeHasChanged(changedAttrs, 'minDate', (newMinDate) => {
      this.element._flatpickr.set('minDate', newMinDate);
    });
  }),

  willDestroyElement() {
    this.element._flatpickr.destroy();
  },

  /**
   * Check if the attr has changed, and if so call the callback with the new value
   * @param {object} changedAttrs The object with keys denoting attrs that have changed
   * @param {string} attr The string of which attr to check for changes
   * @param {function} callback A function to call with the newAttr value
   * @method _attributeHasChanged
   * @private
   */
  _attributeHasChanged(changedAttrs, attr, callback) {
    if (changedAttrs && changedAttrs[attr]) {
      const [oldAttr, newAttr] = changedAttrs[attr];
      if (oldAttr !== newAttr) {
        callback(newAttr);
      }
    }
  },

  /**
   * Action fired when the flatpickr is closed
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method onClose
   * @public
   */
  onClose(/*selectedDates, dateStr, instance*/) {},

  /**
   * Action fired when the flatpickr is opened
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method onOpen
   * @public
   */
  onOpen(/*selectedDates, dateStr, instance*/) {},

  /**
   * Action fired when the flatpickr is ready
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method onReady
   * @public
   */
  onReady(/*selectedDates, dateStr, instance*/) {},

  /**
   * When the date is changed, update the value and send 'onChange' action
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method _onChange
   * @private
   */
  _onChange(selectedDates, dateStr, instance) {
    if (this.onChange instanceof Function) {
      this.onChange(selectedDates, dateStr, instance);
    }
  },

  /**
   * When the flatpickr is closed, fire the 'onClose' action
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method _onClose
   * @private
   */
  _onClose(selectedDates, dateStr, instance) {
    this.onClose(selectedDates, dateStr, instance);
  },

  /**
   * When the flatpickr is opened, fire the 'onOpen' action
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method _onOpen
   * @private
   */
  _onOpen(selectedDates, dateStr, instance) {
    this.onOpen(selectedDates, dateStr, instance);
  },

  /**
   * When the flatpickr is ready, fire the 'onReady' action
   * @param {Date[]} selectedDates The array of selected dates
   * @param {string} dateStr The string representation of the date, formatted by dateFormat
   * @param {flatpickr} instance The flatpickr instance
   * @method _onReady
   * @private
   */
  _onReady(selectedDates, dateStr, instance) {
    this.onReady(selectedDates, dateStr, instance);
  },

  /**
   * Set disabled for the correct input, handling altInput weirdness
   * @param {boolean} disabled Disabled or not
   * @method _setDisabled
   * @private
   */
  _setDisabled(disabled) {
    if (this.get('altInput')) {
      this.element.nextSibling.disabled = disabled;
    } else {
      this.element.disabled = disabled;
    }
  }
});
