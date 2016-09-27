/* eslint-disable */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    let cssPath = 'dist/flatpickr';
    if(app.options && app.options.flatpickr && app.options.flatpickr.theme) {
      cssPath += '.';
      cssPath += app.options.flatpickr.theme;
    }
    cssPath += '.min.css';
    this.theme = cssPath;

    this._super.included.apply(this, arguments);
  },
  options: {
    nodeAssets: {
      flatpickr: function() {
        if (!process.env.EMBER_CLI_FASTBOOT) {
          return {
            import: [
              'dist/flatpickr.js',
              this.theme
            ]
          };
        }
      }
    }
  }
};
