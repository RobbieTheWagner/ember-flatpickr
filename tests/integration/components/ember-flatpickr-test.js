import { find, findAll, triggerEvent } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

moduleForComponent('ember-flatpickr', 'Integration | Component | ember flatpickr', {
  integration: true
});

function clickDay(index) {
  triggerEvent(findAll('.flatpickr-days .flatpickr-day')[index], 'mousedown');
}

function closeFlatpickr() {
  triggerEvent(document, 'mousedown');
}

test('disabled is updated when altInput=true', function(assert) {
  assert.expect(4);

  const originalDate = '2080-12-05T20:00:00.000Z';
  this.set('dateValue', [new Date(originalDate)]);
  this.set('disabled', true);

  this.render(
    hbs`{{ember-flatpickr
    altInput=true
    date=(readonly dateValue)
    disabled=disabled
    onChange=null
    placeholder="Pick date"
    }}`);

  run(() => {
    assert.equal(find('.flatpickr-input[type="hidden"]').disabled, false, 'hidden input not disabled');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, true, 'text input is disabled');

    this.set('disabled', false);

    assert.equal(find('.flatpickr-input[type="hidden"]').disabled, false, 'hidden input not disabled');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, false, 'text input not disabled');
  });
});

test('disabled is updated when altInput=false', function(assert) {
  assert.expect(3);

  const originalDate = '2080-12-05T20:00:00.000Z';
  this.set('dateValue', [new Date(originalDate)]);
  this.set('disabled', true);

  this.render(
    hbs`{{ember-flatpickr
    altInput=false
    date=(readonly dateValue)
    disabled=disabled
    onChange=null
    placeholder="Pick date"
    }}`);

  run(() => {
    assert.notOk(find('.flatpickr-input[type="hidden"]'), 'hidden input does not exist');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, true, 'text input is disabled');

    this.set('disabled', false);

    assert.equal(find('.flatpickr-input[type="text"]').disabled, false, 'text input not disabled');  });
});

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

  assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, '1', 'initial selected date text');

  this.get('flatpickrRef').setDate('2080-12-04T16:16:22.585Z');

  assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, '4', 'selected changes with dateValue');
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
    find('.flatpickr-input').dispatchEvent(new Event('focus'));
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
    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });
});

test('maxDateUpdated and minDateUpdated fired', function(assert) {
  assert.expect(3);

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
    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    run.scheduleOnce('afterRender', this, function() {
      const enabledDays = findAll('.flatpickr-days .flatpickr-day:not(.disabled)');
      assert.equal(enabledDays.length, 2);
      assert.equal(enabledDays[0].textContent, '24');
      assert.equal(enabledDays[1].textContent, '25');
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

  assert.equal(find('.flatpickr-current-month .cur-month').textContent.trim(), 'Décembre', 'French locale applied successfully');
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
    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');
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
    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');
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
    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');

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
