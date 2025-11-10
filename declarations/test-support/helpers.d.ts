/**
 * Checks if the flatpickr calendar is being displayed.
 *
 * @param {Number} [pickrIndex=0] - Index of flatpickr calendar to be targeted (for when multiple exist)
 * @return {Boolean} Whether or not the calendar is visible
 * @function isFlatpickrOpen
 */
export function isFlatpickrOpen(pickrIndex?: number): boolean;
/**
 * Sets the date in the flatpickr
 *
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @param {Object} date - A Date Object or array of Date Objects to set as the selected date(s)
 * @param {Boolean} [triggerChange=true] - If true, this forces onChange events to fire
 * @function setFlatpickrDate
 */
export function setFlatpickrDate(selector: string, date: Object, triggerChange?: boolean): void;
/**
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function closeFlatpickrDate
 */
export function closeFlatpickrDate(selector: string): void;
/**
 * Clears out the flatpickr selectedDates attribute as well as the associated input.
 * @param {String} selector - CSS3 selector of the element to pull the flatpickr instance from
 * @function clearFlatpickrDate
 */
export function clearFlatpickrDate(selector: string): void;
