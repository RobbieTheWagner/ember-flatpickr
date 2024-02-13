import { importSync, macroCondition, getOwnConfig } from '@embroider/macros';

/*
 * This file is only here to initialize the flatpickr registry at the start of the app
 * This behavior can be disabled by setting `initializeFlatpickr` to `false` in the `@embroider/macros` config. The module will be then tree-shaken away if not used in the app.
 */
interface FlatpickrConfig {
  initializeFlatpickr: boolean;
}

if (macroCondition(getOwnConfig<FlatpickrConfig>()?.initializeFlatpickr)) {
  importSync('flatpickr');
}

export function initialize() {
  // noop
}

export default {
  initialize,
};
