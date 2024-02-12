import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import 'flatpickr/dist/l10n/fr';
import 'flatpickr/dist/l10n/de';
import 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/l10n/uk';

export default class EmberFlatpickr extends Controller {
  @tracked dateValue = null;
  @tracked timeValue = null;
  @tracked minDate = null;
  @tracked locale = null;
  @tracked dateRangeValue = [null, null];

  get defaultDate() {
    return '2080-12-27T16:16:22.585Z';
  }

  get classString() {
    return `docs-transition
    focus:docs-outline-0
    docs-border docs-border-transparent
    focus:docs-bg-white
    focus:docs-border-grey-light
    docs-placeholder-grey-darkest
    docs-rounded
    docs-bg-grey-lighter
    docs-py-2 docs-pr-4
    docs-pl-10
    docs-block
    docs-w-2/3
    docs-appearance-none
    docs-leading-normal
    docs-ds-input`;
  }

  get locales() {
    return ['default', 'fr', 'de', 'ru', 'uk'];
  }

  @action
  clearDate() {
    this.dateValue = null;
  }

  @action
  clearTime() {
    this.timeValue = null;
  }

  @action
  onClose() {
    console.log('Flatpickr closed');
  }

  @action
  onCloseTime() {
    console.log('Time Flatpickr closed');
  }

  @action
  onDateChange(_dates, dateStr) {
    this.dateStr = dateStr;
    console.log('onDateChange called');
  }

  @action
  onDatesChange(dateRanges) {
    this.dateRangeValue = dateRanges;
    console.log('onDatesChange called');
  }

  @action
  onTimeChange(_times, timeStr) {
    this.timeValue = timeStr;
    console.log('onTimeChange called');
  }

  @action
  onReady() {
    this.dateValue = this.defaultDate;
    console.log('onReady called');
  }

  @action
  onReadyTime() {
    this.timeValue = null;
    console.log('onReadyTime called');
  }

  @action
  updateMin() {
    next(this, () => {
      this.dateValue = null;
      this.minDate = '2080-12-24T16:16:22.585Z';
    });
  }

  @action
  onChangeLocale(locale) {
    this.locale = locale;
  }
}
