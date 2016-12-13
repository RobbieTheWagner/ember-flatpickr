# Ember-flatpickr

<a href="https://shipshape.io/"><img src="http://i.imgur.com/bU4ABmk.png" width="100" height="100"/></a>

[![npm version](https://badge.fury.io/js/ember-flatpickr.svg)](http://badge.fury.io/js/ember-flatpickr)
[![npm](https://img.shields.io/npm/dm/ember-flatpickr.svg)]()
[![Ember Observer Score](https://emberobserver.com/badges/ember-flatpickr.svg)](https://emberobserver.com/addons/ember-flatpickr)
[![Build Status](https://travis-ci.org/shipshapecode/ember-flatpickr.svg?branch=master)](https://travis-ci.org/shipshapecode/ember-flatpickr)
[![Code Climate](https://codeclimate.com/github/shipshapecode/ember-flatpickr/badges/gpa.svg)](https://codeclimate.com/github/shipshapecode/ember-flatpickr)
[![Test Coverage](https://codeclimate.com/github/shipshapecode/ember-flatpickr/badges/coverage.svg)](https://codeclimate.com/github/shipshapecode/ember-flatpickr/coverage)

This is an Ember addon that wraps the date picker [Flatpickr](http://chmln.github.io/flatpickr/). It uses using ember-cli-node-assets to pull in flatpickr from npm.

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
dateFormat='M/D/Y'
defaultDate=defaultDate
disable=datesToDisable
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
onChange=(action (mut dateValue))
onClose='doSomeStuffOnClose'
onOpen='doSomeStuffOnOpen'
onReady='doSomeStuffOnReady'
parseDate=false
placeholder='Choose a Date'
prevArrow='<'
static=false
timeFormat='H:i'
time_24hr=false
utc=false
value=(readonly dateValue)
wrap=false}}
```

*(`onChange` is the only required option, but you can pass null if you do not care about it. All other options are displayed, but they have defaults and you only need to pass what you need)

**Note:** You should pass your value with the `readonly` helper, and you should only update your value selected in the `onChange` action. If you just want it to be set to the new `dateObject`, you can use `(action (mut dateValue))` like the example above.

Whenever a new date is selected, the action `onChange` will be fired, and passed the new `dateObject` and `dateString` to that action. This allows you to pass whatever action you may want in to happen on change.

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

## Observers

`maxDate` and `minDate` are watched by observers, and will update the flatpickr instance whenever you change them. This allows you to do things like having two components, used as a range picker, and updating the `minDate` and `maxDate` to display valid date choices on each.

## flatpickrRef

If you need to interact directly with the flatpickr instance you have created inside the component, you can pass in `flatpickrRef=myFlatpickrRefName`, which would then be accesible in the controller or parent component. You can then do things like `this.get('myFlatpickrRefName').close()` to close the datepicker, if you wanted to make a close button.

## Options

All options available to Flatpickr are available here.

Please see the [flatpickr docs](https://chmln.github.io/flatpickr/) for a full list of options.

## Contributing

If there are features you would like to see implemented, or we have missed some flatpickr options, please open an issue and/or submit a PR!
