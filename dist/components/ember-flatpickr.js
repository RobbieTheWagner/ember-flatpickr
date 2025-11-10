import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import { waitForPromise } from '@ember/test-waiters';
import flatpickr from 'flatpickr';
import { getOwner } from '@ember/owner';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) {
    return n(i, e, r) || r;
  }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var TEMPLATE = precompileTemplate("<input\n  class=\"ember-flatpickr-input\"\n  type=\"text\"\n  ...attributes\n  {{did-insert this.onInsert}}\n  {{will-destroy this.onWillDestroy}}\n  {{did-update this.onAltFormatUpdated @altFormat}}\n  {{did-update this.onAltInputClassUpdated @altInputClass}}\n  {{did-update this.onDateUpdated @date}}\n  {{did-update this.onDisabledUpdated @disabled}}\n  {{did-update this.onLocaleUpdated @locale}}\n  {{did-update this.onMaxDateUpdated @maxDate}}\n  {{did-update this.onMinDateUpdated @minDate}}\n/>\n\n{{yield}}");

var _class;
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
let EmberFlatpickr = (_class = class EmberFlatpickr extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "flatpickrRef", void 0);
  }
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

  onInsert(element) {
    this.setupFlatpickr(element);
  }
  onWillDestroy() {
    this.flatpickrRef?.destroy();
  }
  setupFlatpickr(element) {
    const {
      date,
      onChange,
      wrap
    } = this.args;

    // Require that users pass a date
    assert('<EmberFlatpickr> requires a `date` to be passed as the value for flatpickr.', date !== undefined);

    // Require that users pass an onChange
    assert('<EmberFlatpickr> requires an `onChange` action or null for no action.', onChange !== undefined);

    // Wrap is not supported
    assert('<EmberFlatpickr> does not support the wrap option. Please see documentation for an alternative.', wrap !== true);

    // Pass all values and setup flatpickr
    scheduleOnce('afterRender', this, this._setFlatpickrOptions, element);
  }
  async _setFlatpickrOptions(element) {
    const fastboot = getOwner(this)?.lookup('service:fastboot');
    if (fastboot && fastboot['isFastBoot']) {
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
    const config = Object.fromEntries(Object.entries(rest).filter(entry => entry[1] !== undefined));
    if (typeof this.args.locale === 'string' && this.args.locale !== 'en') {
      await waitForPromise(import(`flatpickr/dist/l10n/${this.args.locale}.js`));
    }
    this.flatpickrRef = flatpickr(element, {
      onChange,
      onClose: onClose || this.onClose,
      onOpen: onOpen || this.onOpen,
      onReady: onReady || this.onReady,
      ...config,
      defaultDate: date
    });
    this._setDisabled(disabled);
  }
  _setDisabled(disabled) {
    if (!this.flatpickrRef) {
      return;
    }
    const altInput = this.flatpickrRef.altInput;
    const element = this.flatpickrRef.element;
    if (altInput && element?.nextSibling) {
      // `element` is the hidden input storing the alternate date value sent to the server
      // @see https://flatpickr.js.org/options/ `altInput` config options
      // Refactored during https://github.com/RobbieTheWagner/ember-flatpickr/issues/306 to instead
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
   */

  onClose() {
    // Intentionaly empty. This method should be overridden.
  }

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
   */

  onOpen() {
    // Intentionaly empty. This method should be overridden.
  }

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
   */

  onReady() {
    // Intentionaly empty. This method should be overridden.
  }
  onAltFormatUpdated() {
    this.flatpickrRef?.set('altFormat', this.args.altFormat);
  }
  onAltInputClassUpdated() {
    const {
      altInputClass
    } = this.args;

    // updating config anyways, just to keep them in sync:
    this.flatpickrRef?.set('altInputClass', altInputClass || '');

    // https://github.com/flatpickr/flatpickr/issues/861
    const altInput = this.flatpickrRef?.altInput;
    if (altInput) {
      altInput.className = altInputClass || '';
    }
  }
  onDateUpdated() {
    const {
      date
    } = this.args;
    if (typeof date !== 'undefined') {
      this.flatpickrRef?.setDate(date);
    }
  }
  onDisabledUpdated() {
    const {
      disabled
    } = this.args;
    if (typeof disabled !== 'undefined') {
      this._setDisabled(disabled);
    }
  }
  onLocaleUpdated(element) {
    this.flatpickrRef?.destroy();
    this.setupFlatpickr(element);
  }
  onMaxDateUpdated() {
    this.flatpickrRef?.set('maxDate', this.args.maxDate);
  }
  onMinDateUpdated() {
    this.flatpickrRef?.set('minDate', this.args.minDate);
  }
}, _applyDecoratedDescriptor(_class.prototype, "onInsert", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onInsert"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onWillDestroy", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onWillDestroy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onClose", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onClose"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onOpen", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onOpen"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onReady", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onReady"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onAltFormatUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onAltFormatUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onAltInputClassUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onAltInputClassUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onDateUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onDateUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onDisabledUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onDisabledUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onLocaleUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onLocaleUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onMaxDateUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onMaxDateUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onMinDateUpdated", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onMinDateUpdated"), _class.prototype), _class);
setComponentTemplate(TEMPLATE, EmberFlatpickr);

export { EmberFlatpickr as default };
//# sourceMappingURL=ember-flatpickr.js.map
