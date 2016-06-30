/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.css', {prepend: true});
    app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.js', {prepend: true});
  }
};
