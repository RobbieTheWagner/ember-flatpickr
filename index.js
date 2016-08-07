/* eslint-disable */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    this._super.included(app);
    if (!process.env.EMBER_CLI_FASTBOOT) {
      var cssPath = app.bowerDirectory + '/flatpickr/dist/flatpickr'
      var options = app.options.flatpickr;
      // Choose a theme
      if(options && options.theme) {
        cssPath += '.';
        cssPath += options.theme;
      }

      cssPath += '.min.css';

      app.import(cssPath, {prepend: true});
      app.import(app.bowerDirectory + '/flatpickr/dist/flatpickr.js', {prepend: true});
    }
  }
};

/* eslint-enable */
