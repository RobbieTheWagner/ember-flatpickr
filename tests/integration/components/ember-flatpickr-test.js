import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
const { $, run } = Ember;

moduleForComponent('ember-flatpickr', 'Integration | Component | ember flatpickr', {
  integration: true
});

function clickDay(index) {
  simulate('mousedown', $('.flatpickr-days .flatpickr-day').get(index), { which: 1 }, MouseEvent);
}

function closeFlatpickr() {
  simulate('mousedown', document, { which: 1 }, MouseEvent);
}

/*
 * Copied from flatpickr
 */
function simulate(eventType, onElement, options, type) {
  const eventOptions = Object.assign(options || {}, { bubbles: true });
  const evt = new (type || CustomEvent)(eventType, eventOptions);
  try {
    Object.assign(evt, eventOptions);
  } catch(e) {
    // This was empty in flatpickr
  }

  onElement.dispatchEvent(evt);
}

test('value updates when set externally via flatpickrRef', function(assert) {
  assert.expect(2);

  this.on('onChange', () => {
  });

  this.set('dateValue', '2080-12-01T16:16:22.585Z');
  this.set('maxDate', '2080-12-31T16:16:22.585Z');
  this.set('minDate', '2080-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      flatpickrRef=flatpickrRef
      maxDate=maxDate
      minDate=minDate
      onChange="onChange"
      placeholder="Pick date"
      }}`);

  assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), '1', 'initial selected date text');

  this.get('flatpickrRef').setDate('2080-12-04T16:16:22.585Z');

  assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), '4', 'selected changes with dateValue');
});

test('onChange action fired', function(assert) {
  assert.expect(1);

  this.set('dateValue', null);

  const done = assert.async();

  this.on('onChange', (selectedDates) => {
    setTimeout(() => {
      assert.equal(selectedDates[0].toISOString().substring(0, 10), '2080-12-06', 'onChange action was executed');
      done();
    }, 100);
  });

  this.set('maxDate', '2080-12-31T16:16:22.585Z');
  this.set('minDate', '2080-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange="onChange"
      placeholder="Pick date"
      }}`);

  run(() => {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    clickDay(5);
  });
});

test('onClose action fired', function(assert) {
  assert.expect(1);

  this.set('dateValue', null);

  this.on('onClose', () => {
    assert.ok(true, 'onClose action was executed');
  });

  this.set('maxDate', '2080-12-31T16:16:22.585Z');
  this.set('minDate', '2080-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=null
      onClose="onClose"
      placeholder="Pick date"
      }}`);

  run(() => {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });
});

test('maxDateUpdated and minDateUpdated fired', function(assert) {
  assert.expect(2);

  this.set('dateValue', null);

  this.render(
    hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=null
      onClose="onClose"
      placeholder="Pick date"
      }}`);

  this.set('maxDate', '2080-12-25T16:16:22.585Z');
  this.set('minDate', '2080-12-24T16:16:22.585Z');

  run(() => {
    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    run.scheduleOnce('afterRender', this, function() {
      const enabledDays = $('.flatpickr-days .flatpickr-day:not(.disabled)');
      assert.equal(enabledDays.length, 2);
      assert.equal(enabledDays.text(), '2425');
    });
  });
});

test('locale works correctly', function(assert) {
  assert.expect(1);

  this.on('onChange', () => {
  });

  this.set('dateValue', '2080-12-01T16:16:22.585Z');
  this.set('maxDate', '2080-12-31T16:16:22.585Z');
  this.set('minDate', '2080-12-01T16:16:22.585Z');

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      locale="fr"
      maxDate=maxDate
      minDate=minDate
      onChange="onChange"
      placeholder="Pick date"
      }}`);

  assert.equal($('.flatpickr-current-month .cur-month').text().trim(), 'Décembre', 'French locale applied successfully');
});

test('onChange triggers value change only once', function(assert) {
  assert.expect(3);

  const originalPosition = '1';
  const originalDate = '2080-12-01T20:00:00.000Z';
  const newPosition = '5';

  this.on('onChange', (selectedDates) => {
    assert.ok(selectedDates[0].toISOString(), 'onChange action was executed');

    this.set('dateValue', selectedDates[0]);
  });

  this.set('dateValue', originalDate);

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange="onChange"
      placeholder="Pick date"
      }}`);

  run(() => {
    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), originalPosition, 'initial selected date text');

    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), newPosition, 'selected changes with dateValue');
  });

});

test('onChange gets called with the correct parameters', function(assert) {
  const originalPosition = '1';
  const originalDate = '2080-12-01T20:00:00.000Z';
  const newPosition = '5';
  const dateFormat = 'Y-m-d';
  const newFormattedDate = '2080-12-05';

  this.on('onChange', (selectedDates, dateStr, instance) => {
    assert.ok(selectedDates instanceof Array, 'selectedDates is an array');
    assert.equal(selectedDates.length, 1, 'selectedDates contains a single entry');

    assert.ok(selectedDates[0] instanceof Date, 'selectedDates contains DateObjects');

    assert.equal(selectedDates[0].toDateString(), 'Thu Dec 05 2080', 'selectedDates contains the correct Date');

    assert.equal(dateStr, newFormattedDate, 'dateStr is formatted correctly');

    assert.ok(instance instanceof FlatpickrInstance, 'instance is a FlatpickrInstance object');
  });

  this.set('dateValue', originalDate);
  this.set('dateFormat', dateFormat);

  this.render(
    hbs`{{ember-flatpickr
      dateFormat=dateFormat
      date=(readonly dateValue)
      onChange="onChange"
      placeholder="Pick date"
      }}`);

  run(() => {
    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), originalPosition, 'initial selected date text');

    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), newPosition, 'selected changes with dateValue');

    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), newPosition, 'selected changes with dateValue');
  });

});

test('onChange action mut helper returns date Array', function(assert) {
  assert.expect(5);

  const originalPosition = '1';
  const originalDate = '2080-12-01T20:00:00.000Z';
  const newPosition = '5';

  this.set('dateValue', originalDate);

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      }}`);

  run(() => {
    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), originalPosition, 'initial selected date text');

    $('.flatpickr-input')[0].dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal($('.flatpickr-days .flatpickr-day.selected').text(), newPosition, 'selected changes with dateValue');

    assert.ok(this.get('dateValue') instanceof Array, 'dateValue is instanceof Array');
    assert.ok(this.get('dateValue').length, 1, 'dateValue has 1 item');
    assert.ok(this.get('dateValue')[0] instanceof Date, 'dateValue is an array of DateObjects');
  });

});

test('value accepts string', function(assert) {
  assert.expect(2);

  const originalDate = '2080-12-05T20:00:00.000Z';

  this.set('dateValue', originalDate);

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

  run(() => {
    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });
});

test('value accepts date object', function(assert) {
  assert.expect(2);

  const originalDate = '2080-12-05T20:00:00.000Z';

  this.set('dateValue', new Date(originalDate));

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

  run(() => {
    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });
});

test('value accepts array of string', function(assert) {
  assert.expect(2);

  const originalDate = '2080-12-05T20:00:00.000Z';

  this.set('dateValue', [originalDate]);

  this.render(
    hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

  run(() => {
    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });
});

test('value accepts array of date objects', function(assert) {
  assert.expect(2);

  const originalDate = '2080-12-05T20:00:00.000Z';
  this.set('dateValue', [new Date(originalDate)]);

  this.render(
    hbs`{{ember-flatpickr
    date=(readonly dateValue)
    onChange=(action (mut dateValue))
    placeholder="Pick date"
    flatpickrRef=flatpickrRef
    }}`);

  run(() => {
    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });
});
