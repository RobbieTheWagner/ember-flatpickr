'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    const path = require('path');
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

    const distPath = path.dirname(require.resolve('flatpickr'));
    const vendorPath = 'vendor/flatpickr';

    this.import(`${vendorPath}/flatpickr.js`);

    if (app.options && app.options.flatpickr && app.options.flatpickr.theme) {
      this.import(`${distPath}/themes/${app.options.flatpickr.theme}.css`);
    } else {
      this.import(`${distPath}/flatpickr.css`);
    }

    let locales = [];
    if (app.options && app.options.flatpickr && app.options.flatpickr.locales) {
      locales = app.options.flatpickr.locales;
      const localePaths = Array.isArray(locales)
        ? locales.map((locale) => `l10n/${locale}.js`)
        : [];
      localePaths.forEach((locale) => {
        this.import(`${vendorPath}/${locale}`);
      });
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

    let nodes = [browserVendorLib, browserVendorLocales];
    if (defaultTree) {
      nodes.unshift(defaultTree);
    }

    return new mergeTrees(nodes);
  }
};
