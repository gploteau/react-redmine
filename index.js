'use strict';

import React, { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import App from './src/App';
AppRegistry.registerComponent(appName, () => App);
