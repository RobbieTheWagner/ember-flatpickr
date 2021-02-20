import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from 'dummy/config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  docsRoute(this, function () {
    this.route('test-helpers');
    this.route('usage');

    this.route('components', function () {
      this.route('ember-flatpickr');
    });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
