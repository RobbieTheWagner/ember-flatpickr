/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    this._super.included(app);
    app.import(this.treePaths.vendor + '/styles/flatpickr.min.css');
  }
};
