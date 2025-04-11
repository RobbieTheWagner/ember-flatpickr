'use strict';

const path = require('path');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  // dist/index.js
  let entry = require.resolve('ember-flatpickr');

  // We can never assume a node_modules structure
  let dir = path.dirname(path.dirname(entry));

  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      watchDependencies: ['ember-flatpickr'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: dir,
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
