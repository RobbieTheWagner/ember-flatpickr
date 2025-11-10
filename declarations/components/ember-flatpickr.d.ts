/** @documenter yuidoc */
import Component from '@glimmer/component';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import type { BaseOptions as FlatpickrOptions } from 'flatpickr/dist/types/options';
interface EmberFlatpickrArgs extends FlatpickrOptions {
    date: FlatpickrOptions['defaultDate'];
    disabled: boolean;
}
interface EmberFlatpickrSignature {
    Element: HTMLInputElement;
    Args: EmberFlatpickrArgs;
    Blocks: {
        default: [];
    };
}
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
export default class EmberFlatpickr extends Component<EmberFlatpickrSignature> {
    flatpickrRef?: FlatpickrInstance;
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
    onInsert(element: HTMLInputElement): void;
    onWillDestroy(): void;
    setupFlatpickr(element: HTMLInputElement): void;
    _setFlatpickrOptions(element: HTMLInputElement): Promise<void>;
    _setDisabled(disabled: boolean): void;
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
    onClose(): void;
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
    onOpen(): void;
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
    onReady(): void;
    onAltFormatUpdated(): void;
    onAltInputClassUpdated(): void;
    onDateUpdated(): void;
    onDisabledUpdated(): void;
    onLocaleUpdated(element: HTMLInputElement): void;
    onMaxDateUpdated(): void;
    onMinDateUpdated(): void;
}
export {};
