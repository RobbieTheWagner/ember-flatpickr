'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      watchDependencies: ['ember-flatpickr'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../ember-flatpickr',
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
