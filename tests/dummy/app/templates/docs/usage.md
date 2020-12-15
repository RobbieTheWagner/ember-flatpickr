## Usage

```handlebars
<EmberFlatpickr
  placeholder="Choose a Date"
  @allowInput={{false}}
  @altFormat="Y-m-d"
  @altInput={{true}}
  @altInputClass="my-alt-input"
  @clickOpens={{true}}
  @date={{this.defaultDate}} {{!-- Required Option --}}
  @dateFormat="M/D/Y"
  @defaultDate={{this.defaultDate}}
  @defaultHour={{12}}
  @defaultMinute={{0}}
  @disable={{this.datesToDisable}}
  @disableMobile={{false}}
  @enable={{this.datesToEnable}}
  @enableSeconds={{false}}
  @enableTime={{true}}
  @hourIncrement={{1}}
  @inline={{false}}
  @locale="ru"
  @maxDate={{this.maxDate}}
  @minDate={{this.minDate}}
  @minuteIncrement={{5}}
  @mode="single"
  @nextArrow=">"
  @noCalendar={{false}}
  @onChange={{this.onChange}} {{!-- Required Option --}}
  @onClose={{this.onClose}}
  @onOpen={{this.onOpen}}
  @onReady={{this.onReady}} {{!-- Can be used to easily store a reference to the flatpickr input. --}}
  @parseDate={{false}}
  @prevArrow="<"
  @shorthandCurrentMonth={{false}}
  @static={{false}}
  @time_24hr={{false}}
  @weekNumbers={{false}}
/>
```

- (`date` and `onChange` are the only required options, but you can pass null if you do not care about it. All other options are taken straight from the flatpickr options, but they have defaults and you only need to pass what you need.)

**Note:** You should only update your `date` selected in the `onChange` action.

`date` property accepts:

- A single `dateObject`
- A single `string` containing a date formatted accordingly to `dateFormat`
- An array of `dateObject`
- An array of `string` containing dates formatted accordingly to `dateFormat`

`onChange`, `onClose`, `onOpen`, `onReady` receive 3 parameters:

- An array of `dateObjects`
- A string formatted accordingly to `dateFormat` representing the last selected date
- The `Flatpickr` instance

Whenever a new date is selected, the action `onChange` will be fired. We highly encourage you to create your own `onChange` callback and not to use the `mut` helper so that your apps are much easier to reason about such as when a change in your date occurs.

## Themes

flatpickr provides several themes out of the box. You can specify a theme in your `ember-cli-build.js`.

```js
const app = new EmberApp(defaults, {
  flatpickr: {
    theme: 'material_blue',
  },
});
```

## Localization

flatpickr supports [over 25 languages](https://github.com/flatpickr/flatpickr/tree/master/src/l10n). You can specify the locales you want to support
in your `ember-cli-build.js`, which will include the necessary locale js files.

```js
const app = new EmberApp(defaults, {
  flatpickr: {
    locales: ['fr', 'de', 'ru', 'uk'],
  },
});
```

You can then use the locales you imported by specifying which you want in your template, like so:

```handlebars
<EmberFlatpickr
  @locale="ru"
  @date={{this.date}}
  @onChange={{this.onChange}}
/>
```

### Manual Localization Configuration

`locales` option also accepts an object for [custom locale configuration](https://chmln.github.io/flatpickr/#locale). This is useful for reusing app locale code.

The following example is using `moment.js` and assumes that a `userLocale` is specified to look up the correct locale configuration from `moment.js`.

```javascript
import Controller from '@ember/controller';
import { tracked } from "@glimmer/tracking";
import moment from 'moment';

// app/controllers/some-controller.js
export default class SomeController extends Controller {
  @tracked userLocale = 'de';

  get customLocaleConfig() {
    const localeData = moment.localeData(this.userLocale);

    return {
      ordinal: localeData.ordinal,
      weekdays: {
        longhand: localeData.weekdays(),
        shorthand: localeData.weekdaysShort()
      },
      months: {
        longhand: localeData.months(),
        shorthand: localeData.monthsShort()
      }
    };
  }
}
```

```handlebars
<EmberFlatpickr
  @locale={{this.customLocaleConfig}}
  @date={{this.date}}
  @onChange={{this.onChange}}
/>
```

Check [flatpickr locale documentation](https://chmln.github.io/flatpickr/#locale) for a list of config options.

## Updating Attributes

`date`, `locale`, `maxDate` and `minDate` are watched by the component, and will update the flatpickr instance whenever you change them. This allows you to do things like having two components, used as a range picker, and updating the `minDate` and `maxDate` to display valid date choices on each.

## flatpickrRef

If you need to interact directly with the flatpickr instance you have created inside the component, you can use the action `onReady` as `onReady={{this.onReady}}`. The function signature of your onReady callback should look like the following example:

```javascript
@action
onReady(_selectedDates, _dateStr, instance) {
  this.flatpickrRef = instance;
};
```

This action will only get called once per instance and that is when the flatpickr input has been fully created.

Once you have stored the instance, you can then do things like `this.flatpickrRef.close()` to close the datepicker, if you wanted to make a close button.

## Options

All options available to Flatpickr are available here with the exception of wrap.

## ember-flatpickr and external elements

The wrap option for flatpickr causes flatpickr to search its child elements for elements annotated with certain attributes. With ember-flatpickr this can be accomplished with the following


```handlebars
{{!-- components/my-date-picker.hbs --}}

<EmberFlatpickr
  @date={{this.date}}
  @onChange={{this.onChange}}
  @onReady={{this.onReady}}
/>

<a class="input-button" title="toggle" {{on "click" this.toggleCalendar}}>
  <i class="icon-calendar"></i>
</a>

<a class="input-button" title="clear" {{on "click" this.clearCalendar}}>
  <i class="icon-close"></i>
</a>
```

```javascript
// components/my-date-picker.js

import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default MyDatePicker extends Component {

  @tracked flatpickrRef = null

  @action
  onReady(_selectedDates, _dateStr, flatpickrRef) {
    this.flatpickrRef = flatpickrRef
  }

  @action
  toggleCalendar(e) {
    e.stopPropagation()
    this.flatpickrRef.toggle();
  }

  @action
  clearCalendar(e) {
    e.stopPropagation()
    this.flatpickrRef.clear();
  }

}
```

**Note:** In the above example, the `toggleCalendar` and `clearCalendar` actions
receive an argument `e` (the click event) and call `e.stopPropagation` on said event. FlatPickr
is designed to immediately close the calendar popup when user's click outside of it's bounding DOM element. Clicking the above _toggle_ button will call the "open" method on the FlatPickr instance, but since our button lives outside of the bounds of the pickr's calendar, FlatPickr immediately closes the calendar popup. By stopping the propagation of our external click event, FlatPickr does not detect the outside click and the calendar opens as expected.


Please see the [flatpickr docs](https://chmln.github.io/flatpickr/) for a full list of options.
