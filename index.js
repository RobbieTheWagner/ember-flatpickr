'use strict';

const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: require('./package').name,
  options: {
    nodeAssets: {
      flatpickr() {
        const localePaths = Array.isArray(this.locales) ? this.locales.map(locale => `l10n/${locale}.js`) : [];

        return {
          srcDir: 'dist',
          import: {
            include: [
              'flatpickr.js',
              this.theme || 'flatpickr.css'
            ].concat(localePaths),
            processTree(tree) {
              return fastbootTransform(tree);
            }
          }
        };
      }
    }
  },

  included() {
    let app;

    // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
    // use that.
    if (typeof this._findHost === 'function') {
      app = this._findHost();
    } else {
      // Otherwise, we'll use this implementation borrowed from the _findHost()
      // method in ember-cli.
      let current = this;
      do {
        app = current.app || app;
      } while (current.parent.parent && (current = current.parent));
    }

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
