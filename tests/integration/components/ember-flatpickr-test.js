import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
const { $, run } = Ember;

moduleForComponent('ember-flatpickr', 'Integration | Component | ember flatpickr', {
  integration: true
});

function closeFlatpickr() {
  document.dispatchEvent(new Event('click'));
}

test('value updates when set externally', function(assert) {
  this.on('onChange', () => {});

  this.set('dateValue', '2016-12-01T16:16:22.585Z');
  this.set('maxDate', '2016-12-31T16:16:22.585Z');
  this.set('minDate', '2016-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      maxDate=maxDate
      minDate=minDate
      onChange="onChange"
      placeholder="Pick date"
      value=(readonly dateValue)
      }}`);

  assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), '1', 'initial selected date text');

  this.set('dateValue', '2016-12-04T16:16:22.585Z');
  assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), '4', 'selected changes with dateValue');
});

test('onChange action fired', function(assert) {
  this.on('onChange', (actual) => {
    let expected = '2016-12-02T16:16:00.000Z';
    assert.equal(actual.toISOString(), expected, 'onChange action was executed');
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
      onChange="onChange"
      placeholder="Pick date"
      value=(readonly dateValue)
      }}`);

  run(() => {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    $('.flatpickr-days .flatpickr-day').get(5).click();
  });
});

test('onClose action fired', function(assert) {
  this.on('onClose', () => {
    assert.ok(true, 'onClose action was executed');
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
      onChange=null
      onClose="onClose"
      placeholder="Pick date"
      value=(readonly dateValue)
      }}`);

  run(function() {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });
});

test('maxDateUpdated and minDateUpdated fired', function(assert) {
  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      defaultDate='2016-12-27T16:16:22.585Z'
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=null
      onClose="onClose"
      placeholder="Pick date"
      value=(readonly dateValue)
      }}`);

  this.set('maxDate', '2016-12-25T16:16:22.585Z');
  this.set('minDate', '2016-12-24T16:16:22.585Z');

  run(() => {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    run.scheduleOnce('afterRender', this, function() {
      let enabledDays = $('.flatpickr-days .flatpickr-day:not(.disabled)');
      assert.equal(enabledDays.length, 2);
      assert.equal(enabledDays.text(), '2425');
    });
  });
});
