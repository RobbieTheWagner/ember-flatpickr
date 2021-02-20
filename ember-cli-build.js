'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let project = defaults.project;
  let options = {
    // This is to fix builds with uglify https://github.com/ember-cli/ember-cli/issues/8075
    'ember-cli-uglify': {
      uglify: {
        compress: {
          collapse_vars: false
        }
      }
    },
    flatpickr: {
      theme: 'dark',
      locales: ['fr', 'de', 'ru', 'uk']
    }
  };

  if (
    project.findAddonByName('ember-native-dom-event-dispatcher') &&
    process.env.DEPLOY_TARGET === undefined
  ) {
    options.vendorFiles = { 'jquery.js': null };
  }

  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
