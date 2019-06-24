/** @documenter yuidoc */

import Flatpickr from 'ember-flatpickr/mixins/flatpickr';
import TextField from '@ember/component/text-field';

/**
 * Ember component that wraps the lightweight [`flatpickr`](https://flatpickr.js.org) datetime
 * chooser.
 *
 * This component extends Ember's `@ember/component/text-field` and mixes
 * in `ember-flatpickr/mixins/flatpickr`.
 *
 * ```handlebars
 *  {{ember-flatpickr
 *    date=(readonly model.someDate)
 *  }}
 * ```
 *
 * Or using angle brackets:
 *
 * ```handlebars
 *  <EmberFlatpickr @date={{readonly model.someDate}}/>
 * ```
 *
 * @class EmberFlatpickr
 * @element ember-flatpickr
 * @extends TextField
 * @public
 * @uses Flatpickr
 */
export default TextField.extend(Flatpickr, {
  /**
   * ARIA bindings for a textbox.
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role
   * @see https://labs.levelaccess.com/index.php/Category:ARIA
   */
  attributeBindings: [
    'aria-activedescendent',
    'aria-autocomplete',
    'aria-describedby',
    'aria-labelledby',
    'aria-multiline',
    'aria-placeholder',
    'aria-readonly',
    'aria-required'
  ],

  classNames: ['ember-flatpickr-input'],

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

  didInsertElement() {
    this._super(...arguments);
    this.set('field', this.element);
    this.setupFlatpickr();
  }
});
