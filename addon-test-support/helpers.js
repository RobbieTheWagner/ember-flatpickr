import { registerHelper } from '@ember/test';
import { find } from 'ember-native-dom-helpers';

/**
 * Checks if the flatpickr calendar is being displayed.
 * @param {Number} [pickrIndex=0] - Index of flatpickr calendar to be targeted (for when multiple exist)
 * @returns {Boolean}
*/
export function isFlatpickrOpen(pickrIndex = 0) {
  const flatpickerCal = document.getElementsByClassName('flatpickr-calendar')[pickrIndex];
  return flatpickerCal.classList.contains('open');
}

/**
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @param {Object} date - A Date Object or array of Date Objects to set as the selected date(s)
 * @param {Boolean} [triggerChange=true] - If true, this forces onChange events to fire
*/
export function setFlatpickrDate(selector, date, triggerChange = true) {
  const flatpickrInput = find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'setFlatpickrDate');
  flatpickrInput._flatpickr.setDate(date, triggerChange);
}

/**
 * Clears out the flatpickr selectedDates attribute as well as the associated input.
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
*/
export function clearFlatpickrDate(selector) {
  const flatpickrInput = find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'clearFlatpickrDate');
  flatpickrInput._flatpickr.clear();
}

// Registers helpers for acceptance tests

export default function () {
  registerHelper('setFlatpickrDate', function(app, selector, date, triggerChange) {
    return setFlatpickrDate(selector, date, triggerChange);
  });

  registerHelper('clearFlatpickrDate', function(app, selector) {
    return clearFlatpickrDate(selector);
  });
}

function _throwSelectorError(selector, functionName) {
  throw new Error(
    `${functionName}() - No input was found using selector '${selector}'`
  );
}
