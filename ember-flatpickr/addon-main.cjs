"use strict";

const { addonV1Shim } = require("@embroider/addon-shim");

module.exports = {
  ...addonV1Shim(__dirname),
  options: {
    "@embroider/macros": {
      setOwnConfig: {
        initializeFlatpickr: true,
      },
    },
  }
};
