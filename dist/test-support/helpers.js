import { find } from '@ember/test-helpers';

/**
 * Checks if the flatpickr calendar is being displayed.
 *
 * @param {Number} [pickrIndex=0] - Index of flatpickr calendar to be targeted (for when multiple exist)
 * @return {Boolean} Whether or not the calendar is visible
 * @function isFlatpickrOpen
 */
function isFlatpickrOpen(pickrIndex = 0) {
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
function setFlatpickrDate(selector, date, triggerChange = true) {
  const flatpickrInput = selector instanceof HTMLElement ? selector : find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'setFlatpickrDate');
  flatpickrInput._flatpickr.setDate(date, triggerChange);
}

/**
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function closeFlatpickrDate
 */
function closeFlatpickrDate(selector) {
  const flatpickrInput = selector instanceof HTMLElement ? selector : find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'closeFlatpickrDate');
  flatpickrInput._flatpickr.close();
}

/**
 * Clears out the flatpickr selectedDates attribute as well as the associated input.
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function clearFlatpickrDate
 */
function clearFlatpickrDate(selector) {
  const flatpickrInput = selector instanceof HTMLElement ? selector : find(selector);
  if (!flatpickrInput) _throwSelectorError(selector, 'clearFlatpickrDate');
  flatpickrInput._flatpickr.clear(); // eslint-disable-line
}
function _throwSelectorError(selector, functionName) {
  throw new Error(`${functionName}() - No input was found using selector '${selector}'`);
}

export { clearFlatpickrDate, closeFlatpickrDate, isFlatpickrOpen, setFlatpickrDate };
//# sourceMappingURL=helpers.js.map
