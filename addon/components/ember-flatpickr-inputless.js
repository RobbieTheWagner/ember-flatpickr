import Component from '@ember/component';
import Flatpickr from 'ember-flatpickr/mixins/flatpickr';

export default Component.extend(Flatpickr, {
  inline: true,
  didInsertElement() {
    this._super(...arguments);
    this.set('field', this.element);
    this.setupComponent();
  },
});