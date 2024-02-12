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

  // bundle analyzer
  // const { Webpack } = require('@embroider/webpack');
  // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  // return require('@embroider/compat').compatBuild(app, Webpack, {
  //   packagerOptions: {
  //     webpackConfig: {
  //       plugins: [new BundleAnalyzerPlugin()],
  //     },
  //   },
  // });
};
