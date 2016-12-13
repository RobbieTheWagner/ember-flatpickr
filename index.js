/* eslint-disable */
'use strict';

module.exports = {
  name: 'ember-flatpickr',
  included: function(app) {
    let cssPath = 'themes/';
    if (app.options && app.options.flatpickr && app.options.flatpickr.theme) {
      cssPath += app.options.flatpickr.theme;
    }
    else {
      cssPath += 'dark';
    }
    cssPath += '.css';
    this.theme = cssPath;

    this.locales = [];
    if (app.options && app.options.flatpickr && app.options.flatpickr.locales) {
      this.locales = app.options.flatpickr.locales;
    }

    this._super.included.apply(this, arguments);
  },
  options: {
    nodeAssets: {
      flatpickr: function() {
        const localePaths = this.locales.map(locale => `l10n/${locale}.js`)

        return {
          enabled: !process.env.EMBER_CLI_FASTBOOT,
          srcDir: 'dist',
          import: [
            'flatpickr.js',
            this.theme
          ].concat(localePaths)
        };
      }
    }
  }
};
