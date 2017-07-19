# Ember-flatpickr

<a href="https://shipshape.io/"><img src="http://i.imgur.com/bU4ABmk.png" width="100" height="100"/></a>

[![npm version](https://badge.fury.io/js/ember-flatpickr.svg)](http://badge.fury.io/js/ember-flatpickr)
[![npm](https://img.shields.io/npm/dm/ember-flatpickr.svg)]()
[![Ember Observer Score](https://emberobserver.com/badges/ember-flatpickr.svg)](https://emberobserver.com/addons/ember-flatpickr)
[![Build Status](https://travis-ci.org/shipshapecode/ember-flatpickr.svg?branch=master)](https://travis-ci.org/shipshapecode/ember-flatpickr)
[![Code Climate](https://codeclimate.com/github/shipshapecode/ember-flatpickr/badges/gpa.svg)](https://codeclimate.com/github/shipshapecode/ember-flatpickr)
[![Test Coverage](https://codeclimate.com/github/shipshapecode/ember-flatpickr/badges/coverage.svg)](https://codeclimate.com/github/shipshapecode/ember-flatpickr/coverage)

This is an Ember addon that wraps the date picker [flatpickr](http://chmln.github.io/flatpickr/). It uses ember-cli-node-assets to pull in flatpickr from npm.

## Demo

[![Flatpickr](http://i.imgur.com/9ZvagVn.png)](http://shipshapecode.github.io/ember-flatpickr/)
http://shipshapecode.github.io/ember-flatpickr/

## Installation

`ember install ember-flatpickr`

## Usage

```handlebars
{{ember-flatpickr
  allowInput=false
  altFormat='Y-m-d'
  altInput=true
  altInputClass='my-alt-input'
  clickOpens=true
  date=(readonly defaultDate) // Required Option
  dateFormat='M/D/Y'
  defaultDate=defaultDate
  defaultHour=12
  defaultMinute=0
  disable=datesToDisable
  disableMobile=false
  enable=datesToEnable
  enableSeconds=false
  enableTime=true
  flatpickrRef=flatpickrRef
  hourIncrement=1
  inline=false
  locale='ru'
  maxDate=maxDate
  minDate=minDate
  minuteIncrement=5
  mode='single'
  nextArrow='>'
  noCalendar=false
  onChange=(action (mut dateValues)) // Required Option
  onClose=(action 'doSomeStuffOnClose')
  onOpen=(action 'doSomeStuffOnOpen')
  onReady=(action 'doSomeStuffOnReady')
  parseDate=false
  placeholder='Choose a Date'
  prevArrow='<'
  static=false
  timeFormat='H:i'
  time_24hr=false
  utc=false
  wrap=false
}}
```

*(`date` and `onChange` are the only required options, but you can pass null if you do not care about it. All other options are taken straight from the flatpickr options, but they have defaults and you only need to pass what you need.)

**Note:** You should pass your `date` with the `readonly` helper, and you should only update your `date` selected in the `onChange` action. 

`date` property accepts:
  * A single `dateObject`
  * A single `string` containing a date formatted accordingly to `dateFormat`
  * An array of `dateObject`
  * An array of `string` containing dates formatted accordingly to `dateFormat`

`onChange`, `onClose`, `onOpen`, `onReady` receive 3 parameters:
  * An array of `dateObjects` 
  * A string formatted accordingly to `dateFormat` representing the last selected date
  * The `Flatpickr` instance

Whenever a new date is selected, the action `onChange` will be fired: if you just want the event to set the array of selected `dateObject`, you can use `(action (mut dateValues))` like the example above. Otherwise you should implement you own `onChange` action.

## Themes

flatpickr provides several themes out of the box. You can specify a theme in your `ember-cli-build.js`.

```js
const app = new EmberApp(defaults, {
  flatpickr: {
    theme: 'material_blue'
  }
});
```

## Localization

flatpickr supports [over 25 languages](https://github.com/chmln/flatpickr/tree/master/dist/l10n). You can specify the locales you want to support
in your `ember-cli-build.js`, which will include the necessary locale js files.

```js
const app = new EmberApp(defaults, {
  flatpickr: {
    locales: ['fr', 'de', 'ru', 'uk']
  }
});
```

You can then use the locales you imported by specifying which you want in your template, like so:

```handlebars
{{ember-flatpickr
locale='ru'
onChange=(action (mut dateValue))
}}
```

### Manual Localization Configuration
`locales` option also accepts an object for [custom locale configuration](https://chmln.github.io/flatpickr/#locale). This is useful for reusing app locale code.

The following example is using `moment.js` and assumes that a `userLocale` is specified to look up the correct locale configuration from `moment.js`.

```javascript
import Ember from 'ember';
import moment from 'moment';

// app/controllers/some-controller.js
export default Ember.Controller.extend({
  userLocale: 'de',
  
  customLocaleConfig: Ember.computed(function(){
    const userLocale = this.get('userLocale');
    const localeData = moment.localeData(userLocale);
    
    return {
      ordinal: localeData.ordinal,
      weekdays: {
        longhand: localeData.weekdays(),
        shorthand: localeData.weekdaysShort()
      },
      months: {
        longhand: localeData.months()
        shorthand: localeData.monthsShort()
      }
    };
  })
})
```

```handlebars
{{ember-flatpickr
locale=customLocaleConfig
onChange=(action (mut dateValue))
}}
```

Check [flatpickr locale documentation](https://chmln.github.io/flatpickr/#locale) for a list of config options.

## Observers

`maxDate` and `minDate` are watched by observers, and will update the flatpickr instance whenever you change them. This allows you to do things like having two components, used as a range picker, and updating the `minDate` and `maxDate` to display valid date choices on each.

## flatpickrRef

If you need to interact directly with the flatpickr instance you have created inside the component, you can pass in `flatpickrRef=myFlatpickrRefName`, which would then be accesible in the controller or parent component. You can then do things like `this.get('myFlatpickrRefName').close()` to close the datepicker, if you wanted to make a close button.

## Options

All options available to Flatpickr are available here.

Please see the [flatpickr docs](https://chmln.github.io/flatpickr/) for a full list of options.

## Contributing

If there are features you would like to see implemented, or we have missed some flatpickr options, please open an issue and/or submit a PR!
