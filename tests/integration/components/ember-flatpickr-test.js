import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember flatpickr', function (hooks) {
  setupRenderingTest(hooks);

  const clickDay = async (index) => {
    await triggerEvent(
      findAll('.flatpickr-days .flatpickr-day')[index],
      'click'
    );
  };

  const openFlatpickr = async () => {
    await triggerEvent(find('.flatpickr-input'), 'click');
  };

  const closeFlatpickr = async () => {
    await triggerEvent(document.body, 'click');
  };

  test('when rendering with angle brackets', async function (assert) {
    this.set('dateValue', [new Date(2001, 8, 11)]);

    await render(
      hbs`<EmberFlatpickr 
        @date={{this.dateValue}} 
        @onChange={{null}}/>`
    );

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(find('.flatpickr-input').value, '2001-09-11');
  });

  test('when adding aria-activedescendent attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-activedescendent="aria-activedescendent"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-activedescendent'),
      'aria-activedescendent'
    );
  });

  test('when adding aria-autocomplete attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-autocomplete="aria-autocomplete"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-autocomplete'),
      'aria-autocomplete'
    );
  });

  test('when adding aria-describedby attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-describedby="described by"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-describedby'),
      'described by'
    );
  });

  test('when adding aria-labelledby attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-labelledby="aria-labelledby"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-labelledby'),
      'aria-labelledby'
    );
  });

  test('when adding aria-multiline attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-multiline="aria-multiline"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-multiline'),
      'aria-multiline'
    );
  });

  test('when adding aria-placeholder attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-placeholder="aria-placeholder"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-placeholder'),
      'aria-placeholder'
    );
  });

  test('when adding aria- attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-="aria-"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(find('.flatpickr-input').getAttribute('aria-'), 'aria-');
  });

  test('when adding aria-required attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}} 
      @onChange={{null}}
      aria-required="aria-required"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('aria-required'),
      'aria-required'
    );
  });

  test('when adding a title attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr 
      @date={{this.dateValue}}
      @onChange={{null}}
      title="Choose a date"
    />`);

    assert.equal(findAll('.flatpickr-input').length, 1);
    assert.equal(
      find('.flatpickr-input').getAttribute('title'),
      'Choose a date'
    );
  });

  test('disabled is updated when altInput=true', async function (assert) {
    assert.expect(4);

    const originalDate = '2080-12-05T20:00:00.000Z';
    this.set('dateValue', [new Date(originalDate)]);
    this.set('disabled', true);

    await render(hbs`<EmberFlatpickr 
      @altInput={{true}} 
      @date={{this.dateValue}}
      @onChange={{null}} 
      @disabled={{this.disabled}} 
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.flatpickr-input[type="hidden"]').disabled,
      false,
      'hidden input not disabled'
    );

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').disabled,
      true,
      'text input is disabled'
    );

    this.set('disabled', false);

    assert.equal(
      find('.flatpickr-input[type="hidden"]').disabled,
      false,
      'hidden input not disabled'
    );

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').disabled,
      false,
      'text input not disabled'
    );
  });

  test('disabled is updated when altInput=false', async function (assert) {
    assert.expect(3);

    const originalDate = '2080-12-05T20:00:00.000Z';
    this.set('dateValue', [new Date(originalDate)]);
    this.set('disabled', true);

    await render(hbs`<EmberFlatpickr 
      @altInput={{false}} 
      @date={{this.dateValue}} 
      @disabled={{disabled}} 
      @onChange={{null}} placeholder="Pick date"
     />`);

    assert.notOk(
      find('.flatpickr-input[type="hidden"]'),
      'hidden input does not exist'
    );
    assert.equal(
      find('.flatpickr-input[type="text"]').disabled,
      true,
      'text input is disabled'
    );

    this.set('disabled', false);

    assert.equal(
      find('.flatpickr-input[type="text"]').disabled,
      false,
      'text input not disabled'
    );
  });

  test('altFormat updates when changed', async function (assert) {
    assert.expect(2);

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('altFormat', 'j'); // 1-31 (day of month, no leading zeros)

    await render(hbs`<EmberFlatpickr
      @altInput={{true}}
      @altFormat={{this.altFormat}}
      @date={{this.dateValue}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').value,
      '1',
      'initial altFormat value'
    );

    this.set('altFormat', 'Y');

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').value,
      '2080',
      'altFormat updates when changed'
    );
  });

  test('altInputClass updates when changed', async function (assert) {
    assert.expect(2);

    const classNamesBefore =
      'ember-flatpickr-input class-name-1a class-name-1b';

    const classNamesAfter = 'ember-flatpickr-input class-name-2a class-name-2b';

    this.set('dateValue', [new Date()]);
    this.set('altInputClass', classNamesBefore);

    await render(hbs`<EmberFlatpickr
      @altInput={{true}}
      @altInputClass={{this.altInputClass}}
      @date={{this.dateValue}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').className,
      classNamesBefore,
      'initial altInputClass value'
    );

    this.set('altInputClass', classNamesAfter);

    assert.equal(
      find('.ember-flatpickr-input[type="text"]').className,
      classNamesAfter,
      'altInputClass updates when changed'
    );
  });

  test('flatpickrRef is accessible via action', async function (assert) {
    assert.expect(1);

    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('setFlatPickerRef', setFlatPickerRef);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @getFlatpickrRef={{this.setFlatPickerRef}}
      placeholder="Pick date"
    />`);

    assert.notEqual(this.flatpickrRef, null, 'flatpickrRef set via action');
  });

  test('value updates when set externally via flatpickrRef', async function (assert) {
    assert.expect(2);

    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('setFlatPickerRef', setFlatPickerRef);

    await render(hbs`<EmberFlatpickr
        @date={{this.dateValue}}
        @getFlatpickrRef={{this.setFlatPickerRef}}
        @maxDate={{this.maxDate}}
        @minDate={{this.minDate}}
        @onChange={{null}}
        placeholder="Pick date"
    />`);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      '1',
      'initial selected date text'
    );

    this.flatpickrRef.setDate('2080-12-04T16:16:22.585Z');

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      '4',
      'selected changes with dateValue'
    );
  });

  test('onChange action fired', async function (assert) {
    assert.expect(1);

    this.set('dateValue', null);

    const onChange = (selectedDates) => {
      assert.equal(
        selectedDates[0].toISOString().substring(0, 10),
        '2080-12-06',
        'onChange action was executed'
      );
    };

    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('onChange', onChange);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @enableTime={{true}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{this.onChange}}
      placeholder="Pick date"
      />`);

    await openFlatpickr();
    await clickDay(5);
  });

  test('onClose action fired', async function (assert) {
    assert.expect(1);

    const onClose = () => {
      assert.ok(true, 'onClose action was executed');
    };

    this.set('dateValue', null);
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('onClose', onClose);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @enableTime={{true}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      @onClose={{this.onClose}}
      placeholder="Pick date"
    />`);

    await openFlatpickr();
    await closeFlatpickr();
  });

  test('maxDateUpdated and minDateUpdated fired', async function (assert) {
    assert.expect(3);

    this.set('dateValue', null);
    this.set('maxDate', null);
    this.set('minDate', null);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @enableTime={{true}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    this.set('maxDate', '2080-12-25T16:16:22.585Z');
    this.set('minDate', '2080-12-24T16:16:22.585Z');

    await openFlatpickr();

    const enabledDays = findAll(
      '.flatpickr-days .flatpickr-day:not(.flatpickr-disabled)'
    );

    assert.equal(enabledDays.length, 2);
    assert.equal(enabledDays[0].textContent, '24');
    assert.equal(enabledDays[1].textContent, '25');
  });

  test('locale works correctly', async function (assert) {
    assert.expect(1);

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @locale="fr"
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find(
        '.flatpickr-current-month .flatpickr-monthDropdown-month'
      ).textContent.trim(),
      'décembre',
      'French locale applied successfully'
    );
  });

  test('onLocaleUpdated fired', async function (assert) {
    assert.expect(1);

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('locale', 'fr');

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @locale={{this.locale}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    this.set('locale', 'ru');

    await openFlatpickr();

    assert.equal(
      find(
        '.flatpickr-current-month .flatpickr-monthDropdown-month'
      ).textContent.trim(),
      'Декабрь',
      'Russian locale applied successfully'
    );
  });

  test('onChange triggers value change only once', async function (assert) {
    assert.expect(3);

    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';

    const onChange = (selectedDates) => {
      assert.ok(selectedDates[0].toISOString(), 'onChange action was executed');
      this.set('dateValue', selectedDates[0]);
    };

    this.set('dateValue', originalDate);
    this.set('onChange', onChange);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{this.onChange}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text'
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue'
    );
  });

  test('onChange gets called with the correct parameters', async function (assert) {
    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';
    const dateFormat = 'Y-m-d';
    const newFormattedDate = '2080-12-05';

    const onChange = (selectedDates, dateStr) => {
      assert.ok(selectedDates instanceof Array, 'selectedDates is an array');
      assert.equal(
        selectedDates.length,
        1,
        'selectedDates contains a single entry'
      );

      assert.ok(
        selectedDates[0] instanceof Date,
        'selectedDates contains DateObjects'
      );

      assert.equal(
        selectedDates[0].toDateString(),
        'Thu Dec 05 2080',
        'selectedDates contains the correct Date'
      );

      assert.equal(dateStr, newFormattedDate, 'dateStr is formatted correctly');
    };

    this.set('dateValue', originalDate);
    this.set('dateFormat', dateFormat);
    this.set('onChange', onChange);

    await render(hbs`<EmberFlatpickr
      @dateFormat={{this.dateFormat}}
      @date={{this.dateValue}}
      @onChange={{this.onChange}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text'
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue'
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue'
    );
  });

  test('onChange action mut helper returns date Array', async function (assert) {
    assert.expect(5);

    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';
    const onChange = (selectedDates) => {
      this.set('dateValue', selectedDates);
    };

    this.set('dateValue', originalDate);
    this.set('onChange', onChange);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{this.onChange}}
      placeholder="Pick date"
    />`);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text'
    );

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.equal(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue'
    );

    assert.ok(this.dateValue instanceof Array, 'dateValue is instanceof Array');
    assert.ok(this.dateValue.length, 1, 'dateValue has 1 item');
    assert.ok(
      this.dateValue[0] instanceof Date,
      'dateValue is an array of DateObjects'
    );
  });

  test('date accepts string', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('setFlatPickerRef', setFlatPickerRef);
    this.set('dateValue', originalDate);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @getFlatpickrRef={{this.setFlatPickerRef}}
      placeholder="Pick date"
    />`);

    assert.equal(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected'
    );

    assert.equal(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct'
    );
  });

  test('date accepts date object', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('setFlatPickerRef', setFlatPickerRef);
    this.set('dateValue', new Date(originalDate));

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @getFlatpickrRef={{this.setFlatPickerRef}}
      placeholder="Pick date"
    />`);

    assert.equal(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected'
    );
    assert.equal(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct'
    );
  });

  test('date accepts array of string', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('setFlatPickerRef', setFlatPickerRef);
    this.set('dateValue', [originalDate]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @getFlatpickrRef={{this.setFlatPickerRef}}
      placeholder="Pick date"
    />`);

    assert.equal(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected'
    );

    assert.equal(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct'
    );
  });

  test('date accepts array of date objects', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const setFlatPickerRef = (instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('setFlatPickerRef', setFlatPickerRef);
    this.set('dateValue', [new Date(originalDate)]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @getFlatpickrRef={{this.setFlatPickerRef}}
      placeholder="Pick date"
    />`);

    assert.equal(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected'
    );
    assert.equal(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct'
    );
  });
});
