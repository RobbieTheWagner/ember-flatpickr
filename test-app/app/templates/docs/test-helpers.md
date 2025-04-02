## Test Helpers

ember-flatpickr ships with a few [test-helpers](api/modules/ember-flatpickr/test-support/helpers) to make your test cases a little bit DRYer.

### Acceptance Tests

Import `helpers.js` into `.../test/helpers/start-app.js` and call the default function in order to register your helpers.

```javascript
// .../test/helpers/start-app.js

import { run } from "@ember/runloop";
import { merge } from "@ember/polyfills";
import Application from "../../app";
import config from "../../config/environment";
import registerFlatpickrHelpers from "ember-flatpickr/test-support/helpers";

registerFlatpickrHelpers();

export default function startApp(attrs) {
  //...
}
```

Once registered, the helpers can be called directly in your acceptance tests without having to import anything.

### Integration Tests

Simply import the specific helpers you need at the top of your test file.

```javascript
import {
  setFlatpickrDate,
  isFlatpickrOpen,
} from "ember-flatpickr/test-support/helpers";
```
