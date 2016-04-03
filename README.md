# Ember-flatpickr

This is an Ember addon that wraps the date picker Flatpickr. I wanted to use npm instead of bower, so ember-browserify is also required to get this working.

## Installation

`npm i -D flatpickr ember-browserify`

`ember install ember-flatpickr`

## Usage

```hbs
{{ember-flatpickr
altInput=true
altFormat="YYYY-MM-DD"
dateFormat="MM/DD/YYYY"
enableTime=true
hourIncrement=1
minDate=minDate
minuteIncrement=5
timeFormat="HH:mm"
value=value}}
```

## Options

All options available to Flatpickr are available here. Documentaion coming soon!
