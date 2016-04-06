# Ember-flatpickr

This is an Ember addon that wraps the date picker [Flatpickr](http://chmln.github.io/flatpickr/). I wanted to use npm instead of bower, so ember-browserify is also required to get this working.

## Installation

`npm i -D flatpickr ember-browserify`

`ember install ember-flatpickr`

## Usage

```hbs
{{ember-flatpickr
altInput=true
altFormat="Y-m-d"
dateFormat="M/D/Y"
enableTime=true
hourIncrement=1
minDate=minDate
minuteIncrement=5
timeFormat="H:i"
value=(mut dateValue)}}
```

*Note:* If you want the value to update when you select a date, and `onChange` fires, you have to use the `mut` helper.

Whenever a new date is selected, `onChange` will set the value to the newly selected date. It will also fire the action `onChangeAction`, and pass the new `dateObject` to that action.This allows you to pass whatever action you may want in to happen on change.

## Options

All options available to Flatpickr are available here. 

| Config Option |   Type   |    Default   | Description |
|---------------|----------|--------------|-------------|
| altFormat     | `string` |  `"F j, Y"`  |Show the user a readable date (as per altFormat), but return something totally different to the server.|



