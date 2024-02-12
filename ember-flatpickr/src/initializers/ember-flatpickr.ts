import flatpickr from "flatpickr";

export function initialize() {
  if (window) {
    window.flatpickr = flatpickr;
  }
};

export default {
  initialize
};
