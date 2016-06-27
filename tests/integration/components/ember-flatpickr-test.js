import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
const {run} = Ember;

moduleForComponent('ember-flatpickr', 'Integration | Component | ember flatpickr', {
  integration: true
});

function closeFlatpickr() {
  document.dispatchEvent(new Event('click'));
}

test('onChangeAction fired', function (assert) {
  let expected = '2016-12-27T16:16:22.585Z';
  this.on('onChange', (actual) => {
    assert.equal(actual.toISOString(), expected, 'onChangeAction was executed');
  });

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      minDate=minDate
      onChangeAction="onChange"
      placeholder="Pick date"
      value=(mut dateValue)
      }}`);

  run(function () {
    expected = '2016-12-01T16:16:00.000Z';
    this.$('.flatpickr-wrapper input')[0].dispatchEvent(new Event('focus'));
    this.$('.flatpickr-days .slot').first().click();
    closeFlatpickr();
  });
});

test('onCloseAction fired', function (assert) {
  this.on('onClose', () => {
    assert.ok(true, 'onCloseAction was executed');
  });

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      minDate=minDate
      onCloseAction="onClose"
      placeholder="Pick date"
      value=(mut dateValue)
      }}`);

  run(function () {
    this.$('.flatpickr-wrapper input')[0].dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });
});
