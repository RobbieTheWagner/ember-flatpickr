import Application from '@ember/application';
import config from 'test-app/config/environment';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';
import { initialize } from 'ember-flatpickr/initializers/ember-flatpickr';

module('Unit | Initializer | ember-flatpickr', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
    });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  test('window.flatpickr is available after boot', async function (assert) {
    await this.application.boot();
    assert.ok(window.flatpickr, 'flatpickr is available on the window');
    assert.ok(
      window.flatpickr.l10ns,
      'flatpickr locales are available on the window',
    );
  });
});
