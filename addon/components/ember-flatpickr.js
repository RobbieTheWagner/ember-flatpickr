/** @documenter yuidoc */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';

/**
 * Ember component that wraps the lightweight [`flatpickr`](https://flatpickr.js.org) datetime
 * chooser.
 *
 * The `EmberFlatpickr` component requires that you pass in at the very least a `date` property
 * and an `onChange` callback.
 *
 * ```handlebars
 *  <EmberFlatpickr @date={{model.someDate}} @onChange={{this.onChange}} />
 * ```
 *
 * The `EmberFlatpickr` component internally makes use of `...attributes`. This means that any
 * native input attributes that you pass in should be passed in without the `@` symbol.
 * For example
 *
 * ```handlebars
 *  <EmberFlatpickr
 *    aria-activedescendent="aria-activedescendent"
 *    aria-autocomplete="aria-autocomplete"
 *    aria-describedby="described by"
 *    placeholder="Pick a date"
 *    @date={{model.someDate}}
 *    @onChange={{this.onChange}} />
 * ```
 *
 * @class EmberFlatpickr
 * @element EmberFlatpickr
 * @public
 * @uses Flatpickr
 */
export default class EmberFlatpickr extends Component {
  flatpickrRef = null;

  /**
   * The date(s) that will be used to initialize the flatpickr.  When present, the date(s) will
   * be formatted accordingly.
   *
   * Supply one of the following:
   *  * A single dateObject
   *  * A single string containing a date formatted accordingly to dateFormat
   *  * An array of dateObject
   *  * An array of string containing dates formatted accordingly to dateFormat
   *
   * @argument date
   * @type {Array<Date>|Array<String>|Date|String}
   */

  /**
   * A string of characters which are used to define how the date will be displayed in the input box.
   *
   * [The supported characters are defined here.](https://flatpickr.js.org/formatting/)
   *
   * @argument dateFormat
   * @type {String}
   */

  @action
  onInsert(element) {
    this.setupFlatpickr(element);
  }

  @action
  onWillDestroy() {
    this.flatpickrRef.destroy();
  }

  setupFlatpickr(element) {
    const { date, onChange, wrap } = this.args;

    // Require that users pass a date
    assert(
      '<EmberFlatpickr> requires a `date` to be passed as the value for flatpickr.',
      date !== undefined
    );

    // Require that users pass an onChange
    assert(
      '<EmberFlatpickr> requires an `onChange` action or null for no action.',
      onChange !== undefined
    );

    // Wrap is not supported
    assert(
      '<EmberFlatpickr> does not support the wrap option. Please see documentation for an alternative.',
      wrap !== true
    );

    // Pass all values and setup flatpickr
    run.scheduleOnce('afterRender', this, this._setFlatpickrOptions, element);
  }

  _setFlatpickrOptions(element) {
    const fastboot = getOwner(this).lookup('service:fastboot');

    if (fastboot && fastboot.isFastBoot) {
      return;
    }

    const {
      date,
      disabled = false,
      onChange,
      onReady,
      onOpen,
      onClose,
      ...rest
    } = this.args;

    this.flatpickrRef = flatpickr(element, {
      defaultDate: date,
      onChange,
      onClose: onClose || this.onClose,
      onOpen: onOpen || this.onOpen,
      onReady: onReady || this.onReady,
      ...rest
    });

    this._setDisabled(disabled);
  }

  _setDisabled(disabled) {
    if (!this.flatpickrRef) {
      return;
    }

    const { altInput, element } = this.flatpickrRef;

    if (altInput) {
      // `element` is the hidden input storing the alternate date value sent to the server
      // @see https://flatpickr.js.org/options/ `altInput` config options
      // Refactored during https://github.com/shipshapecode/ember-flatpickr/issues/306 to instead
      // extend Ember's `@ember/component/text-field`
      // `element.nextSibling` is the text input that the user will interact with, so
      // long as it is enabled
      element.nextSibling.disabled = disabled;
    } else {
      element.disabled = disabled;
    }
  }

  /**
   * Triggered when the calendar is closed.
   *
   * @method onClose
   * @param {Date[]} selectedDates an array of Date objects selected by the user. When there are
   * no dates selected, the array is empty.
   * @param {String} dateStr a string representation of the latest selected Date object by the
   * user. The string is formatted as per the dateFormat option
   * @param {Object} instance the flatpickr object, containing various methods and properties.
   * @type {Action}
   * @return {void}
   */

  @action
  onClose() {}

  /**
   * Triggered when the calendar is closed.
   *
   * @method onOpen
   * @param {Date[]} selectedDates an array of Date objects selected by the user. When there are
   * no dates selected, the array is empty.
   * @param {String} dateStr a string representation of the latest selected Date object by the
   * user. The string is formatted as per the dateFormat option
   * @param {Object} instance the flatpickr object, containing various methods and properties.
   * @type {Action}
   * @return {void}
   */

  @action
  onOpen() {}

  /**
   * Triggered once the calendar is in a ready state.
   *
   * @method onReady
   * @param {Date[]} selectedDates an array of Date objects selected by the user. When there are
   * no dates selected, the array is empty.
   * @param {String} dateStr a string representation of the latest selected Date object by the
   * user. The string is formatted as per the dateFormat option
   * @param {Object} instance the flatpickr object, containing various methods and properties.
   * @type {Action}
   * @return {void}
   */

  @action
  onReady() {}

  @action
  onAltFormatUpdated() {
    this.flatpickrRef.set('altFormat', this.args.altFormat);
  }

  @action
  onAltInputClassUpdated() {
    const { altInputClass } = this.args;

    // updating config anyways, just to keep them in sync:
    this.flatpickrRef.set('altInputClass', altInputClass || '');

    // https://github.com/flatpickr/flatpickr/issues/861
    const { altInput } = this.flatpickrRef;

    if (altInput) {
      altInput.className = altInputClass || '';
    }
  }

  @action
  onDateUpdated() {
    const { date } = this.args;

    if (typeof date !== 'undefined') {
      this.flatpickrRef.setDate(date);
    }
  }

  @action
  onDisabledUpdated() {
    const { disabled } = this.args;

    if (typeof disabled !== 'undefined') {
      this._setDisabled(disabled);
    }
  }

  @action
  onLocaleUpdated(element) {
    this.flatpickrRef.destroy();
    this.setupFlatpickr(element);
  }

  @action
  onMaxDateUpdated() {
    this.flatpickrRef.set('maxDate', this.args.maxDate);
  }

  @action
  onMinDateUpdated() {
    this.flatpickrRef.set('minDate', this.args.minDate);
  }
}
