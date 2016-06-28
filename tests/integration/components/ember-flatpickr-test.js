import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
const {$, run} = Ember;

moduleForComponent('ember-flatpickr', 'Integration | Component | ember flatpickr', {
  integration: true,
  afterEach(){
    $('.flatpickr-wrapper').remove();
  }
});

function closeFlatpickr() {
  document.dispatchEvent(new Event('click'));
}

test('onChangeAction fired', function (assert) {
  let expected = '2016-12-27T16:16:22.585Z';
  this.on('onChange', (actual) => {
    assert.equal(actual.toISOString(), expected, 'onChangeAction was executed');
  });

  this.set('maxDate', '2016-12-31T16:16:22.585Z');
  this.set('minDate', '2016-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChangeAction="onChange"
      placeholder="Pick date"
      value=(mut dateValue)
      }}`);

  run(function () {
    expected = '2016-12-01T16:16:00.000Z';
    this.$('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    this.$('.flatpickr-days .slot').first().click();
  });
});

test('onCloseAction fired', function (assert) {
  this.on('onClose', () => {
    assert.ok(true, 'onCloseAction was executed');
  });

  this.set('maxDate', '2016-12-31T16:16:22.585Z');
  this.set('minDate', '2016-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onCloseAction="onClose"
      placeholder="Pick date"
      value=(mut dateValue)
      }}`);

  run(function () {
    this.$('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });
});

test('maxDateUpdated and minDateUpdated fired', function (assert) {
  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onCloseAction="onClose"
      placeholder="Pick date"
      value=(mut dateValue)
      }}`);

  this.set('maxDate', '2016-12-25T16:16:22.585Z');
  this.set('minDate', '2016-12-24T16:16:22.585Z');

  run(function () {
    this.$('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    run.scheduleOnce('afterRender', this, function () {
      const enabledDays = this.$('.flatpickr-days .slot');
      assert.equal(enabledDays.length, 2);
      assert.equal(enabledDays.text(), '2425');
    });
  });
});
