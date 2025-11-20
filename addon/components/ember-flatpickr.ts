/** @documenter yuidoc */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { scheduleOnce, later } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { BaseOptions as FlatpickrOptions } from 'flatpickr/dist/types/options';

interface EmberFlatpickrArgs extends FlatpickrOptions {
  date: FlatpickrOptions['defaultDate'];
  disabled: boolean;
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
export default class EmberFlatpickr extends Component<EmberFlatpickrArgs> {
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

  // elements & handlers (kept minimal)
  private inputEl?: HTMLInputElement;
  private calendarEl?: HTMLElement;

  // stores for cleanup and rebinds
  private handlers = {
    inputKeydown: null as ((e: KeyboardEvent) => void) | null,
    calendarKeydown: null as ((e: KeyboardEvent) => void) | null,
    prevKey: null as ((e: KeyboardEvent) => void) | null,
    nextKey: null as ((e: KeyboardEvent) => void) | null,
    monthKey: null as ((e: KeyboardEvent) => void) | null,
    yearKey: null as ((e: KeyboardEvent) => void) | null
  };

  // keep references to header controls so we can remove listeners when they are replaced
  private refs = {
    prev: null as HTMLElement | null,
    next: null as HTMLElement | null,
    month: null as HTMLElement | null,
    year: null as HTMLElement | null
  };
 // private lastCloseAt: number | null = null;

  @action
  onInsert(element: HTMLInputElement): void {
    this.setupFlatpickr(element);
  }

  @action
  onWillDestroy(): void {
    // cleanup all event listeners we may have attached
    if (this.inputEl && this.handlers.inputKeydown) {
      this.inputEl.removeEventListener('keydown', this.handlers.inputKeydown);
    }
    if (this.refs.prev && this.handlers.prevKey) {
      this.refs.prev.removeEventListener('keydown', this.handlers.prevKey);
    }
    if (this.refs.next && this.handlers.nextKey) {
      this.refs.next.removeEventListener('keydown', this.handlers.nextKey);
    }
    if (this.refs.month && this.handlers.monthKey) {
      this.refs.month.removeEventListener('keydown', this.handlers.monthKey);
    }
    if (this.refs.year && this.handlers.yearKey) {
      this.refs.year.removeEventListener('keydown', this.handlers.yearKey);
    }
    if (this.calendarEl && this.handlers.calendarKeydown) {
      this.calendarEl.removeEventListener('keydown', this.handlers.calendarKeydown, true);
    }

    this.flatpickrRef?.destroy();
  }

  setupFlatpickr(element: HTMLInputElement): void {
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
    scheduleOnce('afterRender', this, this._setFlatpickrOptions, element);
  }

  _setFlatpickrOptions(element: HTMLInputElement): void {
    //@ts-expect-error: getOwner returns type unknown, so we have to ignore this until Ember fixes the types
    const fastboot = getOwner(this).lookup('service:fastboot');
    if (fastboot && 'isFastBoot' in fastboot && fastboot.isFastBoot) return;

    const {
      date,
      disabled = false,
      onChange,
      onReady,
      onOpen,
      onClose,
      ...rest
    } = this.args;

    const config: Partial<FlatpickrOptions> = Object.fromEntries(
      Object.entries(rest).filter((entry) => entry[1] !== undefined)
    );

    const self = this;

    const composedOnReady = function (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      self._handleOnReady(element, instance);
        self.onReady();
    };

    const composedOnMonthYearChange = function (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      self._setupHeaderA11y(instance);
      later(self, () => self._focusInitialDay(instance), 50);
    };


    this.flatpickrRef = flatpickr(element, {
      onChange,
      onClose: onClose || this.onClose,
      onOpen: onOpen || this.onOpen,
      onReady: composedOnReady,
      onMonthChange: composedOnMonthYearChange,
      onYearChange: composedOnMonthYearChange,
      ...config,
      defaultDate: date
    });

    this._setDisabled(disabled);
  }

  _setDisabled(disabled: boolean): void {
    if (!this.flatpickrRef) {
      return;
    }

    const altInput = this.flatpickrRef.altInput;
    const element: HTMLInputElement = this.flatpickrRef
      .element as HTMLInputElement;

    if (altInput && element?.nextSibling) {
      // `element` is the hidden input storing the alternate date value sent to the server
      // @see https://flatpickr.js.org/options/ `altInput` config options
      // Refactored during https://github.com/shipshapecode/ember-flatpickr/issues/306 to instead
      // extend Ember's `@ember/component/text-field`
      // `element.nextSibling` is the text input that the user will interact with, so
      // long as it is enabled
      (element.nextSibling as HTMLInputElement).disabled = disabled;
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

  @action
  onClose(): void {
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

  @action
  onOpen(): void {
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

  @action
  onReady(): void {
    // Intentionaly empty. This method should be overridden.
  }

  @action
  onAltFormatUpdated(): void {
    this.flatpickrRef?.set('altFormat', this.args.altFormat);
  }

  @action
  onAltInputClassUpdated(): void {
    const { altInputClass } = this.args;

    // updating config anyways, just to keep them in sync:
    this.flatpickrRef?.set('altInputClass', altInputClass || '');

    // https://github.com/flatpickr/flatpickr/issues/861
    const altInput = this.flatpickrRef?.altInput;

    if (altInput) {
      altInput.className = altInputClass || '';
    }
  }

  @action
  onDateUpdated(): void {
    const { date } = this.args;

    if (typeof date !== 'undefined') {
      this.flatpickrRef?.setDate(date);
    }
  }

  @action
  onDisabledUpdated(): void {
    const { disabled } = this.args;

    if (typeof disabled !== 'undefined') {
      this._setDisabled(disabled);
    }
  }

  @action
  onLocaleUpdated(element: HTMLInputElement): void {
    this.flatpickrRef?.destroy();
    this.setupFlatpickr(element);
  }

  @action
  onMaxDateUpdated(): void {
    this.flatpickrRef?.set('maxDate', this.args.maxDate);
  }

  @action
  onMinDateUpdated(): void {
    this.flatpickrRef?.set('minDate', this.args.minDate);
  }

  // -------------------------
  // Accessibility helpers
  // -------------------------

  private _ensureCalendarId(instance: FlatpickrInstance): string {
    const container = instance.calendarContainer as HTMLElement | undefined;
    if (!container) return '';
    if (!container.id) container.id = `ember-flatpickr-calendar-${Math.random().toString(36).slice(2)}`;
    return container.id;
  }

  private _getEls(container: HTMLElement) {
    return {
      prev: container.querySelector('.flatpickr-prev-month') as HTMLElement | null,
      next: container.querySelector('.flatpickr-next-month') as HTMLElement | null,
      monthSelect: container.querySelector('.flatpickr-monthDropdown-months') as HTMLElement | null,
      curMonth: container.querySelector('.flatpickr-current-month .cur-month') as HTMLElement | null
                || container.querySelector('.flatpickr-current-month') as HTMLElement | null,
      yearInput: container.querySelector('.flatpickr-current-month .cur-year') as HTMLInputElement | null
                 || container.querySelector('.cur-year') as HTMLInputElement | null,
      daysContainer: container.querySelector('.flatpickr-days') as HTMLElement | null,
      focusedDay: container.querySelector('.flatpickr-day[tabindex="0"]') as HTMLElement | null
    };
  }

  private _bindOnce(el: HTMLElement | null, refKey: keyof typeof this.refs, handlerKey: keyof typeof this.handlers, fn: (e: KeyboardEvent) => void) {
    if (!el) return;
    // remove old listener if element changed
    if (this.refs[refKey] && this.refs[refKey] !== el && this.handlers[handlerKey]) {
      this.refs[refKey]!.removeEventListener('keydown', this.handlers[handlerKey]!);
    }
    this.refs[refKey] = el;
    // if handler not yet stored, store and bind
    if (!this.handlers[handlerKey]) {
      this.handlers[handlerKey] = fn;
      el.addEventListener('keydown', fn);
    } else if (this.handlers[handlerKey] && this.refs[refKey] === el) {
      // already bound to the same element: ensure it's present
      // nothing to do
    } else {
      // replace binding
      if (this.handlers[handlerKey]) el.addEventListener('keydown', this.handlers[handlerKey]!);
    }
  }

  private _handleOnReady(element: HTMLInputElement, instance: FlatpickrInstance): void {
    this._bindInputA11y(element, instance);

    const calendar = instance?.calendarContainer as HTMLElement | undefined;
    if (calendar) {
      calendar.setAttribute('role', 'dialog');
      calendar.setAttribute('aria-modal', 'true');
      calendar.setAttribute('aria-label', 'Select date from the calendar');
      if (!calendar.hasAttribute('tabindex')) calendar.setAttribute('tabindex', '0');
    }

    this._setupHeaderA11y(instance);
    this._attachFocusCycle(instance);
    this._focusInitialDay(instance);
  }


  private _focusInitialDay(instance: FlatpickrInstance): void {
    const container = instance.calendarContainer as HTMLElement | undefined;
    if (!container) return;

    const { daysContainer } = this._getEls(container);
    if (daysContainer) {
      daysContainer.setAttribute('role', 'grid');
      daysContainer.querySelectorAll('.dayContainer').forEach((row) => {
        row.setAttribute('role', 'row');
        row.querySelectorAll('.flatpickr-day').forEach((day) => {
          const el = day as HTMLElement;
          el.setAttribute('role', 'gridcell');
          el.setAttribute('tabindex', '-1');
        });
      });
    }

    later(this, () => {
      // choose first enabled in-month day
      const enabledSel = '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay):not(.flatpickr-disabled):not([aria-disabled=\"true\"])';
      const selected = container.querySelector('.flatpickr-day.selected:not(.flatpickr-disabled):not([aria-disabled=\"true\"])') as HTMLElement | null;
      const today = container.querySelector('.flatpickr-day.today:not(.flatpickr-disabled):not([aria-disabled=\"true\"])') as HTMLElement | null;
      const firstEnabled = container.querySelector(enabledSel) as HTMLElement | null;
      const candidate = selected || today || firstEnabled;

      if (candidate) {
        container.querySelectorAll('.flatpickr-day[tabindex="0"]').forEach((el) => (el as HTMLElement).setAttribute('tabindex', '-1'));
        candidate.setAttribute('tabindex', '0');
        candidate.focus({ preventScroll: true });
      } else {
        (container as HTMLElement).focus({ preventScroll: true });
      }
    }, 150);
  }


  private _bindInputA11y(element: HTMLInputElement, instance: FlatpickrInstance): void {
    const visibleInput = (instance.altInput as HTMLInputElement) || element;
    this.inputEl = visibleInput;

    const calendarId = this._ensureCalendarId(instance);

    visibleInput.setAttribute('role', 'combobox');
    visibleInput.setAttribute('aria-haspopup', 'dialog');
    visibleInput.setAttribute('aria-expanded', 'false');
    if (calendarId) visibleInput.setAttribute('aria-controls', calendarId);
    visibleInput.setAttribute('aria-disabled', String(!!this.args.disabled));
  }

  private _setupHeaderA11y(instance: FlatpickrInstance): void {
  const container = instance.calendarContainer as HTMLElement | undefined;
  if (!container) return;

  const { prev, next, monthSelect, yearInput } = this._getEls(container);

  /* -------------------------
   *  Prev / Next Month , month/Year selection Buttons
   * ------------------------ */
  const makeNavKeyHandler = (delta: number) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (instance as any).changeMonth?.(delta);
      later(this, () => this._focusInitialDay(instance), 50);
    }
  };

  if (prev) {
    prev.setAttribute("role", "button");
    prev.setAttribute("tabindex", "0");
    prev.setAttribute("aria-label", "Previous month");
    this._bindOnce(prev, "prev", "prevKey", makeNavKeyHandler(-1));
  }

  if (next) {
    next.setAttribute("role", "button");
    next.setAttribute("tabindex", "0");
    next.setAttribute("aria-label", "Next month");
    this._bindOnce(next, "next", "nextKey", makeNavKeyHandler(1));
  }

 
  if (monthSelect) {
    monthSelect.setAttribute("aria-label", "Select month");
    monthSelect.setAttribute("tabindex", "0");

    // No custom keyboard needed for native <select>
    this._bindOnce(monthSelect, "month", "monthKey", () => {});
  }


  if (yearInput) {
    yearInput.setAttribute("aria-label", "Enter year");
    yearInput.setAttribute("inputmode", "numeric");
    yearInput.setAttribute("tabindex", "0");

    const yearKeyHandler = (e: KeyboardEvent) => {
      const key = e.key;

      // Only Arrow Up / Down change year
      if (key !== "ArrowUp" && key !== "ArrowDown") return;

      e.preventDefault();

      key === 'ArrowDown' ? -1 : 1;    
     const current = parseInt(yearInput.value, 10) ||(instance as any).currentYear || new Date().getFullYear();

      yearInput.value = String(current + key);

      yearInput.dispatchEvent(new Event("change", { bubbles: true }));

      later(this, () => this._focusInitialDay(instance), 50);
    };

    this._bindOnce(yearInput, "year", "yearKey", yearKeyHandler);
  }
}


 /**
 * Attach keyboard focus trapping inside the flatpickr calendar.
 * Ensures users can Tab through header controls + days,
 * and safely wrap even when prev/next/month input is missing.
 */
private _attachFocusCycle(instance: FlatpickrInstance): void {
  const container = instance.calendarContainer as HTMLElement | undefined;
  if (!container) return;

  this.calendarEl = container;

  if (this.handlers.calendarKeydown) return; // already attached

  this.handlers.calendarKeydown = (e: KeyboardEvent) => {
    // Record keyboard selection to debounce reopen in input handler
    // if ((e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement)?.classList?.contains('flatpickr-day')) {
    //   this.lastCloseAt = Date.now();
    // }
    if (e.key !== "Tab") return;
    e.preventDefault();

    const order = this._getTabOrder(container);
    if (!order.length) return;

    const active = document.activeElement as HTMLElement | null;
    let idx = active ? order.indexOf(active) : -1;

    if (idx === -1) {
      idx = 0; // default to first item in cycle
    }

    idx = e.shiftKey
      ? (idx - 1 + order.length) % order.length
      : (idx + 1) % order.length;

    const target = order[idx];

    // Maintain correct tabindex for days
    if (target.classList.contains("flatpickr-day")) {
      container.querySelectorAll(".flatpickr-day[tabindex='0']")
        .forEach((d) => d.setAttribute("tabindex", "-1"));
      target.setAttribute("tabindex", "0");
    }

    target.focus({ preventScroll: true });
  };

  container.addEventListener("keydown", this.handlers.calendarKeydown, true);
}
/**
 * Returns proper tabbing order for the datepicker.
 * Handles missing prev/next/month/year gracefully.
 */
private _getTabOrder(container: HTMLElement): HTMLElement[] {
  const prev = container.querySelector(".flatpickr-prev-month:not(.flatpickr-disabled)") as HTMLElement | null;
  const next = container.querySelector(".flatpickr-next-month:not(.flatpickr-disabled)") as HTMLElement | null;

  const monthSelect = container.querySelector(".flatpickr-monthDropdown-months") as HTMLElement | null;
  const curMonth = container.querySelector(".flatpickr-current-month .cur-month") as HTMLElement | null;
  const yearInput = container.querySelector(".cur-year") as HTMLElement | null;

  const focusedDay =
    container.querySelector(".flatpickr-day[tabindex='0']") ||
    container.querySelector(".flatpickr-day.selected:not(.flatpickr-disabled)") ||
    container.querySelector(".flatpickr-day.today:not(.flatpickr-disabled)") ||
    container.querySelector(".flatpickr-day:not(.flatpickr-disabled)")

  const headerMonth = monthSelect || curMonth;

  const orderRaw = [prev, headerMonth, yearInput, next, focusedDay];

  return (orderRaw.filter(Boolean) as HTMLElement[]).filter(
    (el, i, arr) => arr.indexOf(el) === i
  );
}
}
