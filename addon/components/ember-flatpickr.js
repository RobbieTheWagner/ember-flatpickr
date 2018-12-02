import Component from '@ember/component';
import Flatpickr from 'ember-flatpickr/mixins/flatpickr';

export default Component.extend(Flatpickr, {
  tagName: 'input',
  type: "text",
  attributeBindings: ["placeholder", "type"],
  didInsertElement() {
    this._super(...arguments);
    this.set('field', this.element);
    this.setupComponent();
  }
});
