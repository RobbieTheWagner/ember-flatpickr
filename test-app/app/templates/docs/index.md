# ember-flatpickr

<a href="https://shipshape.io/"><img src="http://i.imgur.com/KVqNjgO.png" alt="Ship Shape" width="100" height="100"/></a>

**[ember-flatpickr is built and maintained by Ship Shape. Contact us for Ember.js consulting, development, and training for your project](https://shipshape.io/ember-consulting/)**.

[![npm version](https://badge.fury.io/js/ember-flatpickr.svg)](http://badge.fury.io/js/ember-flatpickr)
[![npm](https://img.shields.io/npm/dm/ember-flatpickr.svg)]()
[![Ember Observer Score](https://emberobserver.com/badges/ember-flatpickr.svg)](https://emberobserver.com/addons/ember-flatpickr)
[![CI](https://github.com/RobbieTheWagner/ember-flatpickr/actions/workflows/ci.yml/badge.svg)](https://github.com/RobbieTheWagner/ember-flatpickr/actions/workflows/ci.yml)

This is an Ember addon that wraps the date picker [flatpickr](http://chmln.github.io/flatpickr/).

## Installation

```bash
ember install ember-flatpickr
```

ember-flatpickr requires `flatpickr` as a peer dependency. Install it with your favorite package manager:

```bash
npm install -D flatpickr
pnpm add -D flatpickr
yarn add -D flatpickr
```

### Default style

By default, ember-flatpickr does not include any styles. You can include the default flatpickr styles by adding the following to your `app.css` file:

```css
@import "flatpickr/dist/flatpickr.css";
```
