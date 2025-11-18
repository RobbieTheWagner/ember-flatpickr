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
  private lastCloseAt: number | null = null;

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
      if (onReady) {
        if (Array.isArray(onReady)) {
          onReady.forEach(fn => fn(selectedDates, dateStr, instance));
        } else {
          onReady(selectedDates, dateStr, instance);
        }
      } else {
        self.onReady();
      }
    };

    const composedOnClose = function (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      self._handleOnClose(instance);
      if (onClose) {
        if (Array.isArray(onClose)) {
          onClose.forEach(fn => fn(selectedDates, dateStr, instance));
        } else {
          onClose(selectedDates, dateStr, instance);
        }
      } else {
        self.onClose();
      }
    };

    // Use consumer-provided onChange directly; avoid manual close to prevent key-driven re-entrant issues


    const composedOnMonthChange = function (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      self._refreshHeaderA11y(instance);
      later(self, () => self._focusInitialDay(instance), 50);
      const user = (self.args as any).onMonthChange;
      if (user) {
        if (Array.isArray(user)) user.forEach((fn: any) => fn(selectedDates, dateStr, instance));
        else user(selectedDates, dateStr, instance);
      }
    };

    const composedOnYearChange = function (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      self._refreshHeaderA11y(instance);
      later(self, () => self._focusInitialDay(instance), 50);
      const user = (self.args as any).onYearChange;
      if (user) {
        if (Array.isArray(user)) user.forEach((fn: any) => fn(selectedDates, dateStr, instance));
        else user(selectedDates, dateStr, instance);
      }
    };

    this.flatpickrRef = flatpickr(element, {
      onChange,
      onClose: composedOnClose,
      onOpen: onOpen || this.onOpen,
      onReady: composedOnReady,
      onMonthChange: composedOnMonthChange,
      onYearChange: composedOnYearChange,
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

    this._refreshHeaderA11y(instance);
    this._attachFocusCycle(instance);
    this._focusInitialDay(instance);
  }

  private _handleOnClose(_instance: FlatpickrInstance): void {
    if (this.inputEl) {
      this.inputEl.setAttribute('aria-expanded', 'false');
      this.inputEl.focus();
    }
    this.lastCloseAt = Date.now();
    if (this.calendarEl && this.handlers.calendarKeydown) {
      this.calendarEl.removeEventListener('keydown', this.handlers.calendarKeydown, true);
      this.handlers.calendarKeydown = null;
    }
  }

  private _refreshHeaderA11y(instance: FlatpickrInstance): void {
    // re-setup header and month/year controls after every re-render
    this._setupHeaderNavA11y(instance);
    this._setupMonthYearA11y(instance);
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

private _onInputKeyDown(e: KeyboardEvent): void {
  if (!this.flatpickrRef || this.args.disabled) return;

  const key = e.key;
  const fp = this.flatpickrRef;
  const isOpen = fp.isOpen;
  const fromCalendar = (e.target as HTMLElement | null)?.closest?.('.flatpickr-calendar');

  const justClosed = this.lastCloseAt && Date.now() - this.lastCloseAt < 250;

  // Do not treat Enter from inside the calendar as an open-trigger on the input
  if (key === 'Enter' && fromCalendar) {
    return;
  }

  // 🚫 FIX: Let flatpickr handle Enter by itself
  if (key === 'Enter') {
    return;
  }

  // Handle open with Space or ArrowDown only
  if (key === ' ' || key === 'ArrowDown') {
    if (!isOpen && justClosed) return;
    e.preventDefault();
    fp.open();
    requestAnimationFrame(() => this._focusInitialDay(fp));
    return;
  }

  if (key === 'Escape') {
    e.preventDefault();
    fp.close();
    this.inputEl?.focus();
  }
}




  private _bindInputA11y(element: HTMLInputElement, instance: FlatpickrInstance): void {
    const visibleInput = (instance.altInput as HTMLInputElement) || element;
    this.inputEl = visibleInput;

    if (instance.altInput) element.setAttribute('aria-hidden', 'true');

    const calendarId = this._ensureCalendarId(instance);

    visibleInput.setAttribute('role', 'combobox');
    visibleInput.setAttribute('aria-haspopup', 'dialog');
    visibleInput.setAttribute('aria-expanded', 'false');
    if (calendarId) visibleInput.setAttribute('aria-controls', calendarId);
    visibleInput.setAttribute('aria-disabled', String(!!this.args.disabled));

    if (!this.handlers.inputKeydown) {
      this.handlers.inputKeydown = (e: KeyboardEvent) => this._onInputKeyDown(e);
      visibleInput.addEventListener('keydown', this.handlers.inputKeydown);
    }
  }

  private _setupHeaderNavA11y(instance: FlatpickrInstance): void {
    const container = instance.calendarContainer as HTMLElement | undefined;
    if (!container) return;
    const { prev, next } = this._getEls(container);

    // prev button
    if (prev) {
      prev.setAttribute('role', 'button');
      prev.setAttribute('tabindex', '0');
      prev.setAttribute('aria-label', 'Previous month');
      const fn = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (instance as any).changeMonth?.(-1);
          later(this, () => this._focusInitialDay(instance), 50);
        }
      };
      this._bindOnce(prev, 'prev', 'prevKey', fn);
    }

    // next button
    if (next) {
      next.setAttribute('role', 'button');
      next.setAttribute('tabindex', '0');
      next.setAttribute('aria-label', 'Next month');
      const fn = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (instance as any).changeMonth?.(1);
          later(this, () => this._focusInitialDay(instance), 50);
        }
      };
      this._bindOnce(next, 'next', 'nextKey', fn);
    }
  }

  private _setupMonthYearA11y(instance: FlatpickrInstance): void {
    const container = instance.calendarContainer as HTMLElement | undefined;
    if (!container) return;
    const { monthSelect, curMonth, yearInput } = this._getEls(container);

    // month select (native)
    if (monthSelect) {
      monthSelect.setAttribute('aria-label', 'Month');
      monthSelect.setAttribute('tabindex', '0');
      // no custom key handler for native select
      this._bindOnce(monthSelect, 'month', 'monthKey', (_e: KeyboardEvent) => {/* noop */});
    } else if (curMonth) {
      // fallback interactive label
      curMonth.setAttribute('role', 'combobox');
      curMonth.setAttribute('tabindex', '0');
      curMonth.setAttribute('aria-label', 'Month');
      const fn = (e: KeyboardEvent) => this._onMonthKey(e, instance);
      this._bindOnce(curMonth, 'month', 'monthKey', fn);
    }

    // year input
    if (yearInput) {
      yearInput.setAttribute('aria-label', 'Year');
      yearInput.setAttribute('inputmode', 'numeric');
      yearInput.setAttribute('tabindex', '0');
      const fn = (e: KeyboardEvent) => this._onYearKey(e, instance, yearInput);
      this._bindOnce(yearInput, 'year', 'yearKey', fn);
    }
  }

  private _onMonthKey(e: KeyboardEvent, instance: FlatpickrInstance) {
    const key = e.key;
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End'].indexOf(key) === -1) return;
    e.preventDefault();

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      (instance as any).changeMonth?.(-1);
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      (instance as any).changeMonth?.(1);
    } else if (key === 'Home') {
      const current = (instance as any).currentMonth ?? 0;
      (instance as any).changeMonth?.(0 - current);
    } else if (key === 'End') {
      const current = (instance as any).currentMonth ?? 0;
      (instance as any).changeMonth?.(11 - current);
    }

    later(this, () => this._focusInitialDay(instance), 50);
  }

  private _onYearKey(e: KeyboardEvent, instance: FlatpickrInstance, yearInput: HTMLInputElement) {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].indexOf(key) === -1) return;
    e.preventDefault();

    const step = (key === 'PageUp' || key === 'PageDown' ? 10 : 1) *
      (key === 'ArrowDown' || key === 'PageDown' ? -1 : 1);

    const currentYear = parseInt(yearInput.value || String((instance as any).currentYear || new Date().getFullYear()), 10);
    const nextYear = isNaN(currentYear) ? new Date().getFullYear() : currentYear + step;
    yearInput.value = String(nextYear);

    const evt = new Event('change', { bubbles: true });
    yearInput.dispatchEvent(evt);

    later(this, () => this._focusInitialDay(instance), 50);
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
    if ((e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement)?.classList?.contains('flatpickr-day')) {
      this.lastCloseAt = Date.now();
    }
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
