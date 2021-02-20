import { default as _flatpickr } from 'flatpickr';

// Types for compiled templates
// declare module 'ember-flatpickr/templates/*' {
//   import { TemplateFactory } from 'htmlbars-inline-precompile';
//   const tmpl: TemplateFactory;
//   export default tmpl;
// }

declare global {
  const flatpickr: typeof _flatpickr;
}
