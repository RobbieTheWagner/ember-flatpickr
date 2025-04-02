# Localization

flatpickr supports [over 25 languages](https://github.com/flatpickr/flatpickr/tree/master/src/l10n).

## Default Language

If you want to switch the default language for all flatpickr instances, you can do so by setting the language using the static flatpickr method localize:

```js
import flatpickr from "flatpickr";
import lang from "flatpickr/dist/l10n";

flatpickr.localize(lang.fr);
```

## Per-Instance Language

If you want to use a different language for a specific flatpickr instance, you can do so by passing the language to the `locale` option using a `string` or a `locale object` :

### String locale

```handlebars
<EmberFlatpickr @locale="fr" @date={{this.date}} @onChange={{this.onChange}} />
```

### Locale object

You can also pass a `locale object` imported from flatpickr to the `locale` option:

```js
import lang from "flatpickr/dist/l10n";

export default class MyComponent extends Component {
  locale = lang.fr;
}
```

```handlebars
<EmberFlatpickr
  @locale={{this.locale}}
  @date={{this.date}}
  @onChange={{this.onChange}}
/>
```

## Manual Localization Configuration

`locales` option also accepts an object for [custom locale configuration](https://flatpickr.js.org/localization/#localization-in-a-browser-environment). This is useful for reusing app locale code.

The following example is using `moment.js` and assumes that a `userLocale` is specified to look up the correct locale configuration from `moment.js`.

```javascript
import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import moment from "moment";

// app/controllers/some-controller.js
export default class SomeController extends Controller {
  @tracked userLocale = "de";

  get customLocaleConfig() {
    const localeData = moment.localeData(this.userLocale);

    return {
      ordinal: localeData.ordinal,
      weekdays: {
        longhand: localeData.weekdays(),
        shorthand: localeData.weekdaysShort(),
      },
      months: {
        longhand: localeData.months(),
        shorthand: localeData.monthsShort(),
      },
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

Check [flatpickr locale documentation](https://flatpickr.js.org/localization/) for a list of config options.
