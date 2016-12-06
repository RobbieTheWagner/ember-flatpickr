/* eslint-disable */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    let cssPath = 'themes/';
    if(app.options && app.options.flatpickr && app.options.flatpickr.theme) {
      cssPath += app.options.flatpickr.theme;
    } 
    else {
      cssPath += 'dark';
    }
    cssPath += '.css';
    this.theme = cssPath;

    this._super.included.apply(this, arguments);
  },
  options: {
    nodeAssets: {
      flatpickr: function() {
        if (!process.env.EMBER_CLI_FASTBOOT) {
          return {
            srcDir: 'dist',
            import: [
              'flatpickr.js',
              this.theme
            ]
          };
        }
      }
    }
  }
};
