/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    this._super.included(app);

    this.app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.css');
    this.app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.min.js');
  }
};
