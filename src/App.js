/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
"use strict";

import React, { Component } from "react";
/*import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';*/

import { Provider } from "react-redux";
import configStore from "@common/configStore";
import { AppNavigator, middleware } from "@common/routeConfig";
import SplashScreen from "react-native-splash-screen";
//import NotifService from "./common/notifService";
import appConfig from "@src/app.json";
import RNLanguages from "react-native-languages";
import i18n from "@common/i18n";

const store = configStore(middleware);

/*
const API_URL = 'http://vendorbox.fr:3031';

const feathersClient = feathers();
const options = {transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000};
const socket = io(API_URL, options);

feathersClient
  .configure(socketio(socket))
  .configure(hooks())
  .configure(authentication({ storage: AsyncStorage }));
*/

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    // this.state = {
    //   senderId: appConfig.senderID
    // };
    //
    // global.notif = new NotifService(
    //   this.onRegister.bind(this),
    //   this.onNotif.bind(this),
    //   appConfig.senderID
    // );
  }
  componentDidMount() {
    SplashScreen.hide();
    RNLanguages.addEventListener("change", this._onLanguagesChange);
  }

  componentWillUnmount() {
    RNLanguages.removeEventListener("change", this._onLanguagesChange);
  }

  _onLanguagesChange = ({ language }) => {
    i18n.locale = language;
  };

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
  // onRegister(token) {
  //   //Alert.alert('Registered !', JSON.stringify(token));
  //   console.log(token);
  //   this.setState({ registerToken: token.token, gcmRegistered: true });
  // }
  //
  // onNotif(notif) {
  //   console.log(notif);
  //   Alert.alert(notif.title, notif.message);
  // }
  //
  // handlePerm(perms) {
  //   Alert.alert("Permissions", JSON.stringify(perms));
  // }
}
