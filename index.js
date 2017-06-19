/* eslint-env node */
'use strict';

const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-flatpickr',
  options: {
    nodeAssets: {
      flatpickr() {
        const localePaths = this.locales.map(locale => `l10n/${locale}.js`);

        return {
          srcDir: 'dist',
          import: [
            'flatpickr.js',
            this.theme || 'flatpickr.css'
          ].concat(localePaths),
          processTree(input) {
            return fastbootTransform(input);
          }
        };
      }
    }
  },

  included(app) {
    if (app.options && app.options.flatpickr && app.options.flatpickr.theme) {
      this.theme = `themes/${app.options.flatpickr.theme}.css`;
    }

    this.locales = [];
    if (app.options && app.options.flatpickr && app.options.flatpickr.locales) {
      this.locales = app.options.flatpickr.locales;
    }

    this._super.included.apply(this, arguments);
  }
};
