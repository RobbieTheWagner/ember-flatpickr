'use strict';

// Ensure ReadableStream/TransformStream exist during build (Node 16)
try {
  const webStreams = require('stream/web');
  if (typeof global.ReadableStream === 'undefined' && webStreams?.ReadableStream) {
    global.ReadableStream = webStreams.ReadableStream;
  }
  if (typeof global.TransformStream === 'undefined' && webStreams?.TransformStream) {
    global.TransformStream = webStreams.TransformStream;
  }
  // Provide Blob on Node 16
  const { Blob: NodeBlob } = require('buffer');
  if (typeof global.Blob === 'undefined' && NodeBlob) {
    global.Blob = NodeBlob;
  }
} catch (e) {
  // ignore if not available
}

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let options = {
    flatpickr: {
      theme: 'dark',
      locales: ['fr', 'de', 'ru', 'uk']
    }
  };

  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit'
      }
    ]
  });
};
