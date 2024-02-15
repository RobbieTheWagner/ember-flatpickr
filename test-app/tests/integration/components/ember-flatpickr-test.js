import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  focus,
  render,
  find,
  findAll,
  triggerEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  clearFlatpickrDate,
  closeFlatpickrDate,
  setFlatpickrDate,
} from 'ember-flatpickr/test-support/helpers';
import langs from 'flatpickr/dist/l10n';

const clickDay = async (index) => {
  await triggerEvent(findAll('.flatpickr-days .flatpickr-day')[index], 'click');
};

const openFlatpickr = async () => {
  await triggerEvent(find('.flatpickr-input'), 'mousedown');
  await focus('.flatpickr-input');
};

const closeFlatpickr = async () => {
  await click(document.body);
};

module('Integration | Component | ember flatpickr', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    closeFlatpickr();
  });

  test('when rendering with angle brackets', async function (assert) {
    this.set('dateValue', [new Date(2001, 8, 11)]);

    await render(
      hbs`<EmberFlatpickr
        @date={{this.dateValue}}
        @onChange={{null}}/>`,
    );

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    assert.strictEqual(find('.flatpickr-input').value, '2001-09-11');
  });

  test('when adding aria-autocomplete attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-autocomplete="both"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert.dom(flatpickrInput).hasAttribute('aria-autocomplete', 'both');
  });

  test('when adding aria-describedby attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-describedby="described by"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert.dom(flatpickrInput).hasAttribute('aria-describedby', 'described by');
  });

  test('when adding aria-labelledby attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-labelledby="aria-labelledby"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert
      .dom(flatpickrInput)
      .hasAttribute('aria-labelledby', 'aria-labelledby');
  });

  test('when adding aria-multiline attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-multiline="true"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert.dom(flatpickrInput).hasAttribute('aria-multiline', 'true');
  });

  test('when adding aria-placeholder attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-placeholder="aria-placeholder"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert
      .dom(flatpickrInput)
      .hasAttribute('aria-placeholder', 'aria-placeholder');
  });

  test('when adding aria-required attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      aria-required="true"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    const flatpickrInput = find('.flatpickr-input');
    assert.dom(flatpickrInput).hasAttribute('aria-required', 'true');
  });

  test('when adding a title attribute it is assigned to the picker input', async function (assert) {
    this.set('dateValue', [new Date()]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      title="Choose a date"
    />`);

    assert.strictEqual(findAll('.flatpickr-input').length, 1);
    assert.strictEqual(
      find('.flatpickr-input').getAttribute('title'),
      'Choose a date',
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

    assert.false(
      find('.flatpickr-input[type="hidden"]').disabled,
      'hidden input not disabled',
    );

    assert.true(
      find('.ember-flatpickr-input[type="text"]').disabled,
      'text input is disabled',
    );

    this.set('disabled', false);

    assert.false(
      find('.flatpickr-input[type="hidden"]').disabled,
      'hidden input not disabled',
    );

    assert.false(
      find('.ember-flatpickr-input[type="text"]').disabled,
      'text input not disabled',
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
      @disabled={{this.disabled}}
      @onChange={{null}} placeholder="Pick date"
     />`);

    assert.notOk(
      find('.flatpickr-input[type="hidden"]'),
      'hidden input does not exist',
    );
    assert.true(
      find('.flatpickr-input[type="text"]').disabled,
      'text input is disabled',
    );

    this.set('disabled', false);

    assert.false(
      find('.flatpickr-input[type="text"]').disabled,
      'text input not disabled',
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

    assert.strictEqual(
      find('.ember-flatpickr-input[type="text"]').value,
      '1',
      'initial altFormat value',
    );

    this.set('altFormat', 'Y');

    assert.strictEqual(
      find('.ember-flatpickr-input[type="text"]').value,
      '2080',
      'altFormat updates when changed',
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

    assert.strictEqual(
      find('.ember-flatpickr-input[type="text"]').className,
      classNamesBefore,
      'initial altInputClass value',
    );

    this.set('altInputClass', classNamesAfter);

    assert.strictEqual(
      find('.ember-flatpickr-input[type="text"]').className,
      classNamesAfter,
      'altInputClass updates when changed',
    );
  });

  test('The onReady callback can used as a mechanism for storing a reference to the flatpickr input.', async function (assert) {
    assert.expect(1);

    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('onReady', onReady);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
    />`);

    assert.notEqual(this.flatpickrRef, null, 'flatpickrRef set via action');
  });

  test('value updates when set externally via flatpickrRef', async function (assert) {
    assert.expect(2);

    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('onReady', onReady);

    await render(hbs`<EmberFlatpickr
        @date={{this.dateValue}}
        @maxDate={{this.maxDate}}
        @minDate={{this.minDate}}
        @onChange={{null}}
        @onReady={{this.onReady}}
        placeholder="Pick date"
    />`);

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      '1',
      'initial selected date text',
    );

    this.flatpickrRef.setDate('2080-12-04T16:16:22.585Z');

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      '4',
      'selected changes with dateValue',
    );
  });

  test('onChange action fired', async function (assert) {
    assert.expect(1);

    this.set('dateValue', null);

    const onChange = (selectedDates) => {
      assert.strictEqual(
        selectedDates[0].toISOString().substring(0, 10),
        '2080-12-06',
        'onChange action was executed',
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

    const done = assert.async();

    const onClose = () => {
      assert.ok(true, 'onClose action was executed');
      done();
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
      '.flatpickr-days .flatpickr-day:not(.flatpickr-disabled)',
    );

    assert.strictEqual(enabledDays.length, 2);
    assert.strictEqual(enabledDays[0].textContent, '24');
    assert.strictEqual(enabledDays[1].textContent, '25');
  });

  test('locale works correctly', async function (assert) {
    assert.expect(1);

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('locale', langs.fr);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @locale={{this.locale}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    assert.strictEqual(
      find(
        '.flatpickr-current-month .flatpickr-monthDropdown-month',
      ).textContent.trim(),
      'décembre',
      'French locale applied successfully',
    );
  });

  test('locale as string works correctly', async function (assert) {
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

    assert.strictEqual(
      find(
        '.flatpickr-current-month .flatpickr-monthDropdown-month',
      ).textContent.trim(),
      'décembre',
      'French locale applied successfully',
    );
  });

  test('onLocaleUpdated fired', async function (assert) {
    assert.expect(1);

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('maxDate', '2080-12-31T16:16:22.585Z');
    this.set('minDate', '2080-12-01T16:16:22.585Z');
    this.set('locale', langs.fr);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @locale={{this.locale}}
      @maxDate={{this.maxDate}}
      @minDate={{this.minDate}}
      @onChange={{null}}
      placeholder="Pick date"
    />`);

    this.set('locale', langs.ru);

    await openFlatpickr();

    assert.strictEqual(
      find(
        '.flatpickr-current-month .flatpickr-monthDropdown-month',
      ).textContent.trim(),
      'Декабрь',
      'Russian locale applied successfully',
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

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text',
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue',
    );
  });

  test('onChange gets called with the correct parameters', async function (assert) {
    assert.expect(13);

    const originalPosition = '1';
    const originalDate = '2080-12-01T20:00:00.000Z';
    const newPosition = '5';
    const dateFormat = 'Y-m-d';
    const newFormattedDate = '2080-12-05';

    const onChange = (selectedDates, dateStr) => {
      assert.ok(selectedDates instanceof Array, 'selectedDates is an array');
      assert.strictEqual(
        selectedDates.length,
        1,
        'selectedDates contains a single entry',
      );

      assert.ok(
        selectedDates[0] instanceof Date,
        'selectedDates contains DateObjects',
      );

      assert.strictEqual(
        selectedDates[0].toDateString(),
        'Thu Dec 05 2080',
        'selectedDates contains the correct Date',
      );

      assert.strictEqual(
        dateStr,
        newFormattedDate,
        'dateStr is formatted correctly',
      );
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

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text',
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue',
    );

    await openFlatpickr();
    await clickDay(newPosition - 1);

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue',
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

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      originalPosition,
      'initial selected date text',
    );

    find('.flatpickr-input').dispatchEvent(new Event('focus'));
    await clickDay(newPosition - 1);

    assert.strictEqual(
      find('.flatpickr-days .flatpickr-day.selected').textContent,
      newPosition,
      'selected changes with dateValue',
    );

    assert.ok(this.dateValue instanceof Array);
    assert.ok(this.dateValue.length, 1);
    assert.ok(
      this.dateValue[0] instanceof Date,
      'dateValue is an array of DateObjects',
    );
  });

  test('date accepts string', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('onReady', onReady);
    this.set('dateValue', originalDate);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
    />`);

    assert.strictEqual(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected',
    );

    assert.strictEqual(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct',
    );
  });

  test('date accepts date object', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('onReady', onReady);
    this.set('dateValue', new Date(originalDate));

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
    />`);

    assert.strictEqual(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected',
    );
    assert.strictEqual(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct',
    );
  });

  test('date accepts array of string', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('onReady', onReady);
    this.set('dateValue', [originalDate]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
    />`);

    assert.strictEqual(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected',
    );

    assert.strictEqual(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct',
    );
  });

  test('date accepts array of date objects', async function (assert) {
    assert.expect(2);

    const originalDate = '2080-12-05T20:00:00.000Z';
    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('onReady', onReady);
    this.set('dateValue', [new Date(originalDate)]);

    await render(hbs`<EmberFlatpickr
      @date={{this.dateValue}}
      @onChange={{null}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
    />`);

    assert.strictEqual(
      this.flatpickrRef.selectedDates.length,
      1,
      '1 date is selected',
    );
    assert.strictEqual(
      this.flatpickrRef.selectedDates[0].valueOf(),
      new Date(originalDate).valueOf(),
      'selected date is correct',
    );
  });

  test('it will not override Flatpickr defaults with undefined', async function (assert) {
    const onReady = (_selectedDates, _dateStr, instance) => {
      this.set('flatpickrRef', instance);
    };

    this.set('dateValue', '2080-12-01T16:16:22.585Z');
    this.set('onReady', onReady);

    await render(
      hbs`<EmberFlatpickr
        @date={{this.dateValue}}
        @onChange={{null}}
        @onReady={{this.onReady}}
        @disable={{undefined}}
      />`,
    );

    assert.deepEqual(
      this.flatpickrRef.config.disable,
      [],
      'disable config was not overwritten',
    );
  });

  module('Addon test support', (hooks) => {
    async function renderFlatPickr() {
      await render(
        hbs`<EmberFlatpickr
          @date={{this.date}}
          @onChange={{null}}
          data-test-ember-flatpickr
        />`,
      );
    }

    hooks.beforeEach(async function () {
      this.set('date', null);
      await renderFlatPickr();
    });

    test('setFlatpickrDate allows an html element as selector', async function (assert) {
      assert.expect(1);
      const flatpickr = find('[data-test-ember-flatpickr]');
      const date = new Date('2080-12-01T16:16:22.585Z');

      setFlatpickrDate(flatpickr, date);

      assert.strictEqual(
        flatpickr._flatpickr.selectedDates[0].toISOString(),
        '2080-12-01T16:16:22.000Z',
      );
    });

    test('closeFlatpickrDate allows an html element as selector', async function (assert) {
      assert.expect(2);
      const flatpickr = find('[data-test-ember-flatpickr]');

      flatpickr._flatpickr.open();

      assert.true(flatpickr._flatpickr.isOpen);

      closeFlatpickrDate(flatpickr);

      assert.false(flatpickr._flatpickr.isOpen);
    });

    test('clearFlatpickrDate allows an html element as selector', async function (assert) {
      this.set('date', new Date('2080-12-01T16:16:22.000Z'));
      const flatpickr = find('[data-test-ember-flatpickr]');
      assert.strictEqual(
        flatpickr._flatpickr.selectedDates[0].toISOString(),
        '2080-12-01T16:16:22.000Z',
      );
      clearFlatpickrDate(flatpickr);
      assert.strictEqual(flatpickr._flatpickr.selectedDates[0], undefined);
    });
  });
});
