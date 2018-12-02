import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember flatpickr', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  async function clickDay(index) {
    await triggerEvent(findAll('.flatpickr-days .flatpickr-day')[index], 'mousedown');
  }

  async function closeFlatpickr() {
    await triggerEvent(document.body, 'mousedown');
  }

  test('disabled is updated when altInput=true', async function(assert) {
    assert.expect(4);

    const originalDate = '2080-12-05T20:00:00.000Z';
    this.set('dateValue', [new Date(originalDate)]);
    this.set('disabled', true);

    await render(hbs`{{ember-flatpickr
    altInput=true
    date=(readonly dateValue)
    disabled=disabled
    onChange=null
    placeholder="Pick date"
    }}`);

    assert.equal(find('.flatpickr-input[type="hidden"]').disabled, false, 'hidden input not disabled');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, true, 'text input is disabled');

    this.set('disabled', false);

    assert.equal(find('.flatpickr-input[type="hidden"]').disabled, false, 'hidden input not disabled');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, false, 'text input not disabled');
  });

  test('disabled is updated when altInput=false', async function(assert) {
    assert.expect(3);

    const originalDate = '2080-12-05T20:00:00.000Z';
    this.set('dateValue', [new Date(originalDate)]);
    this.set('disabled', true);

    await render(hbs`{{ember-flatpickr
    altInput=false
    date=(readonly dateValue)
    disabled=disabled
    onChange=null
    placeholder="Pick date"
    }}`);

    assert.notOk(find('.flatpickr-input[type="hidden"]'), 'hidden input does not exist');
    assert.equal(find('.flatpickr-input[type="text"]').disabled, true, 'text input is disabled');

    this.set('disabled', false);

    assert.equal(find('.flatpickr-input[type="text"]').disabled, false, 'text input not disabled');
  });

  test('altFormat updates when changed', async function(assert) {
    assert.expect(2);

    this.actions.onChange = () => {
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('altFormat', 'j'); // 1-31 (day of month, no leading zeros)

    await render(hbs`{{ember-flatpickr
      altInput=true
      altFormat=altFormat
      date=(readonly dateValue)
      flatpickrRef=flatpickrRef
      onChange="onChange"
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-input[type="text"]').value, '1', 'initial altFormat value');

    this.set('altFormat', 'Y');

    assert.equal(find('.flatpickr-input[type="text"]').value, '2080', 'altFormat updates when changed');
  });

  test('value updates when set externally via flatpickrRef', async function(assert) {
    assert.expect(2);

    this.actions.onChange = () => {
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      flatpickrRef=flatpickrRef
      maxDate=maxDate
      minDate=minDate
      onChange=(action "onChange")
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, '1', 'initial selected date text');

    this.get('flatpickrRef').setDate('2080-12-04T16:16:22.585Z');

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, '4', 'selected changes with dateValue');
  });

  test('onChange action fired', async function(assert) {
    assert.expect(1);

    this.set('dateValue', null);

    const done = assert.async();

    this.actions.onChange = (selectedDates) => {
      setTimeout(() => {
        assert.equal(selectedDates[0].toISOString().substring(0, 10), '2080-12-06', 'onChange action was executed');
        done();
      }, 100);
    };

    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');

    await render(hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=(action "onChange")
      placeholder="Pick date"
      }}`);

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(5);
  });

  test('onClose action fired', async function(assert) {
    assert.expect(1);

    this.set('dateValue', null);

    this.actions.onClose = () => {
      assert.ok(true, 'onClose action was executed');
    };

    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');

    await render(hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=null
      onClose=(action "onClose")
      placeholder="Pick date"
      }}`);

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    closeFlatpickr();
  });

  test('maxDateUpdated and minDateUpdated fired', async function(assert) {
    assert.expect(3);

    this.set('dateValue', null);

    await render(hbs`{{ember-flatpickr
      appendDataInput=true
      date=(readonly dateValue)
      enableTime=true
      maxDate=maxDate
      minDate=minDate
      onChange=null
      placeholder="Pick date"
      }}`);

    this.set('maxDate', '2080-12-25T16:16:22.585Z');
    this.set('minDate', '2080-12-24T16:16:22.585Z');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    const enabledDays = findAll('.flatpickr-days .flatpickr-day:not(.disabled)');
    assert.equal(enabledDays.length, 2);
    assert.equal(enabledDays[0].textContent, '24');
    assert.equal(enabledDays[1].textContent, '25');
  });

  test('locale works correctly', async function(assert) {
    assert.expect(1);

    this.actions.onChange = () => {
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      locale="fr"
      maxDate=maxDate
      minDate=minDate
      onChange=(action "onChange")
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-current-month .cur-month').textContent.trim(), 'décembre', 'French locale applied successfully');
  });

  test('onChange triggers value change only once', async function(assert) {
    assert.expect(3);

    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';

    this.actions.onChange = (selectedDates) => {
      assert.ok(selectedDates[0].toISOString(), 'onChange action was executed');

      this.set('dateValue', selectedDates[0]);
    };

    this.set('dateValue', originalDate);

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action "onChange")
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');
  });

  test('onChange gets called with the correct parameters', async function(assert) {
    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';
    const dateFormat = 'Y-m-d';
    const newFormattedDate = '2080-12-05';

    this.actions.onChange = (selectedDates, dateStr) => {
      assert.ok(selectedDates instanceof Array, 'selectedDates is an array');
      assert.equal(selectedDates.length, 1, 'selectedDates contains a single entry');

      assert.ok(selectedDates[0] instanceof Date, 'selectedDates contains DateObjects');

      assert.equal(selectedDates[0].toDateString(), 'Thu Dec 05 2080', 'selectedDates contains the correct Date');

      assert.equal(dateStr, newFormattedDate, 'dateStr is formatted correctly');
    };

    this.set('dateValue', originalDate);
    this.set('dateFormat', dateFormat);

    await render(hbs`{{ember-flatpickr
      dateFormat=dateFormat
      date=(readonly dateValue)
      onChange=(action "onChange")
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');
  });

  test('onChange action mut helper returns date Array', async function(assert) {
    assert.expect(5);

    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';

    this.set('dateValue', originalDate);

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      }}`);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, originalPosition, 'initial selected date text');

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.equal(find('.flatpickr-days .flatpickr-day.selected').textContent, newPosition, 'selected changes with dateValue');

    assert.ok(this.get('dateValue') instanceof Array, 'dateValue is instanceof Array');
    assert.ok(this.get('dateValue').length, 1, 'dateValue has 1 item');
    assert.ok(this.get('dateValue')[0] instanceof Date, 'dateValue is an array of DateObjects');
  });

  test('date accepts string', async function(assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';

    this.set('dateValue', originalDate);

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });

  test('date accepts date object', async function(assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';

    this.set('dateValue', new Date(originalDate));

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });

  test('date accepts array of string', async function(assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';

    this.set('dateValue', [originalDate]);

    await render(hbs`{{ember-flatpickr
      date=(readonly dateValue)
      onChange=(action (mut dateValue))
      placeholder="Pick date"
      flatpickrRef=flatpickrRef
      }}`);

    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });

  test('date accepts array of date objects', async function(assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    this.set('dateValue', [new Date(originalDate)]);

    await render(hbs`{{ember-flatpickr
    date=(readonly dateValue)
    onChange=(action (mut dateValue))
    placeholder="Pick date"
    flatpickrRef=flatpickrRef
    }}`);

    assert.equal(this.get('flatpickrRef').selectedDates.length, 1, '1 date is selected');
    assert.equal(this.get('flatpickrRef').selectedDates[0].valueOf(), new Date(originalDate).valueOf(), 'selected date is correct');
  });
});