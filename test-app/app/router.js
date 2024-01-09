import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from 'test-app/config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  this.route('flatpickr-test');

  docsRoute(this, function () {
    this.route('test-helpers');
    this.route('localization');
    this.route('usage');

    this.route('components', function () {
      this.route('ember-flatpickr');
    });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
