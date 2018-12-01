import EmberObject from '@ember/object';
import FlatpickrMixin from 'ember-flatpickr/mixins/flatpickr';
import { module, test } from 'qunit';

module('Unit | Mixin | flatpickr', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let FlatpickrObject = EmberObject.extend(FlatpickrMixin);
    let subject = FlatpickrObject.create();
    assert.ok(subject);
  });
});
