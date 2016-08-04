/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    this._super.included(app);
    if (!process.env.EMBER_CLI_FASTBOOT) {
      // This will only be included in the browser build
      app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.css', {prepend: true});
      app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.js', {prepend: true});
    }
  }
};
