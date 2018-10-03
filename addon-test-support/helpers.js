import { deprecate } from '@ember/debug';
import { registerHelper } from '@ember/test';
import { find } from '@ember/test-helpers';

/**
 * Checks if the flatpickr calendar is being displayed.
 *
 * @param {Number} [pickrIndex=0] - Index of flatpickr calendar to be targeted (for when multiple exist)
 * @return {Boolean} Whether or not the calendar is visible
 * @function isFlatpickrOpen
*/
export function isFlatpickrOpen(pickrIndex = 0) {
  const flatpickerCal = document.getElementsByClassName('flatpickr-calendar')[pickrIndex];
  return flatpickerCal.classList.contains('open');
}

/**
 * Sets the date in the flatpickr
 *
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @param {Object} date - A Date Object or array of Date Objects to set as the selected date(s)
 * @param {Boolean} [triggerChange=true] - If true, this forces onChange events to fire
 * @function setFlatpickrDate
*/
export function setFlatpickrDate(selector, date, triggerChange = true) {
  const flatpickrInput = find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'setFlatpickrDate');
  flatpickrInput._flatpickr.setDate(date, triggerChange);
}

/**
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function closeFlatpickrDate
*/
export function closeFlatpickrDate(selector) {
  const flatpickrInput = find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'closeFlatpickrDate');
  flatpickrInput._flatpickr.close();
}

/**
 * Clears out the flatpickr selectedDates attribute as well as the associated input.
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function clearFlatpickrDate
*/
export function clearFlatpickrDate(selector) {
  const flatpickrInput = find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'clearFlatpickrDate');
  flatpickrInput._flatpickr.clear();
}

// Registers helpers for acceptance tests

export default function () {
  registerHelper('closeFlatpickrDate', function(app, selector) {
    deprecate(
      'Using the implicit global helper `closeFlatpickrDate` is deprecated. Please, import it explicitly with `import { closeFlatpickrDate } from "ember-flatpickr/test-support"`',
      true,
      { id: 'ember-flatpickr-global-close-flatpickr-date', until: '3.0.0' }
    );
    return closeFlatpickrDate(selector);
  });

  registerHelper('setFlatpickrDate', function(app, selector, date, triggerChange) {
    deprecate(
      'Using the implicit global helper `setFlatpickrDate` is deprecated. Please, import it explicitly with `import { setFlatpickrDate } from "ember-flatpickr/test-support"`',
      true,
      { id: 'ember-flatpickr-global-set-flatpickr-date', until: '3.0.0' }
    );
    return setFlatpickrDate(selector, date, triggerChange);
  });

  registerHelper('clearFlatpickrDate', function(app, selector) {
    deprecate(
      'Using the implicit global helper `clearFlatpickrDate` is deprecated. Please, import it explicitly with `import { clearFlatpickrDate } from "ember-flatpickr/test-support"`',
      true,
      { id: 'ember-flatpickr-global-clear-flatpickr-date', until: '3.0.0' }
    );
    return clearFlatpickrDate(selector);
  });
}

function _throwSelectorError(selector, functionName) {
  throw new Error(
    `${functionName}() - No input was found using selector '${selector}'`
  );
}
