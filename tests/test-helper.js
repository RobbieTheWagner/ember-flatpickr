import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { settings } from 'ember-native-dom-helpers';
import { start } from 'ember-qunit';

const { APP: { rootElement } } = config;
settings.rootElement = rootElement || settings.rootElement;

setApplication(Application.create(config.APP));

start();
