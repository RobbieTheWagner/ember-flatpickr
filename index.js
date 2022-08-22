'use strict';

module.exports = {
  name: require('./package').name,

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

    const vendorPath = 'vendor/flatpickr';

    const options = (app.options && app.options.flatpickr) || {};

    // To be included in vendor file by default and should be ignored if includeInVendor is false
    if (options.includeInVendor !== false) {
      this.import(`${vendorPath}/flatpickr.js`);

      if (options.theme) {
        this.import(`${vendorPath}/themes/${options.theme}.css`);
      } else {
        this.import(`${vendorPath}/flatpickr.css`);
      }

      let locales = [];
      if (options.locales) {
        locales = options.locales;
        const localePaths = Array.isArray(locales)
          ? locales.map((locale) => `l10n/${locale}.js`)
          : [];
        localePaths.forEach((locale) => {
          this.import(`${vendorPath}/${locale}`);
        });
      }
    }

    this._super.included.apply(this, arguments);
  },

  treeForVendor(defaultTree) {
    const map = require('broccoli-stew').map;
    const Funnel = require('broccoli-funnel');
    const mergeTrees = require('broccoli-merge-trees');
    const path = require('path');

    const distPath = path.dirname(require.resolve('flatpickr'));

    let browserVendorLib = new Funnel(distPath, {
      destDir: 'flatpickr',
      files: ['flatpickr.js']
    });

    browserVendorLib = map(
      browserVendorLib,
      (content) => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    let browserVendorLocales = new Funnel(path.join(distPath, '/l10n'), {
      destDir: 'flatpickr/l10n',
      include: ['*.js']
    });

    browserVendorLocales = map(
      browserVendorLocales,
      (content) => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    let defaultCSS = new Funnel(distPath, {
      destDir: 'flatpickr',
      include: ['flatpickr.css']
    });

    let themes = new Funnel(path.join(distPath, '/themes'), {
      destDir: 'flatpickr/themes',
      include: ['*.css']
    });

    let nodes = [browserVendorLib, browserVendorLocales, defaultCSS, themes];

    if (defaultTree) {
      nodes.unshift(defaultTree);
    }

    return new mergeTrees(nodes);
  }
};
