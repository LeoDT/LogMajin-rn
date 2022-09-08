/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';

import {Provider} from 'jotai';
import 'react-native-get-random-values';

import './i18n';

import App from './App';
import {name as appName} from './app.json';

function Root() {
  return React.createElement(Provider, {children: React.createElement(App)});
}

AppRegistry.registerComponent(appName, () => Root);
