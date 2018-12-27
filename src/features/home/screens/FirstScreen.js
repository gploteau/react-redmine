// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  Image,
  View,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Animated
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StackActions, NavigationActions } from "react-navigation";
import * as homeActions from "@home.redux/actions";
import * as commonActions from "@common.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { delay, debug } from "@common/helpers";
import Svg, { G, Path } from "react-native-svg";
import { RalewayText, ReduxForm } from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center"
  },
  screenContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#CCC",
    justifyContent: "center"
  }
});

class FirstScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    const { actions, navigation, common } = this.props;

    debug.trace("FirstScreen._loadFeatures", "Start AsyncStorage");

    AsyncStorage.getItem("@settings")
      .then(value => {
        debug.trace("FirstScreen._loadFeatures", "Get settings storage", value);
        if (value) {
          navigation.navigate("Home");
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const { actions, home, navigation, common } = this.props;

    return (
      <View style={styles.screenContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#7f1010" />
        <View style={styles.welcomeContainer}>
          <View style={{ paddingBottom: 30, alignItems: "center" }}>
            <Svg
              height="66.001251"
              width="96.748749"
              viewBox="0 0 96.748748 66.001253"
            >
              <G transform="translate(-59.847143,-308.69005)">
                <Path
                  d="m 59.847143,374.6913 h 21 l 1.5,-18.00125 -19.50125,-4.49875 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 63.597143,349.19005 18.75,4.5 4.5,-15.75 -15.75,-8.24875 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 72.595893,326.69005 15,8.25 12.00125,-8.25 -11.25,-12.75 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 156.59589,374.6913 h -20.99875 l -1.50125,-18.00125 19.50125,-4.49875 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 152.84589,349.19005 -18.75,4.5 -4.49875,-15.75 15.74875,-8.24875 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 143.84589,326.69005 -15,8.25 -11.99875,-8.25 11.25,-12.75 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 92.097143,311.69005 11.249997,13.5 h 10.49875 l 9.75125,-13.5 -9.75125,-3 h -10.7625 z"
                  fill="#4c4c4c"
                />
                <Path
                  d="m 59.847143,374.6913 h 21 l 1.5,-18.00125 -19.50125,-4.49875 z"
                  fill="#9c0000"
                />
                <Path
                  d="m 63.597143,349.19005 18.75,4.5 4.5,-15.75 -15.75,-8.24875 z"
                  fill="#b50808"
                />
                <Path
                  d="m 72.595893,326.69005 15,8.25 12.00125,-8.25 -11.25,-12.75 z"
                  fill="#c61818"
                />
                <Path
                  d="m 156.59589,374.6913 h -20.99875 l -1.50125,-18.00125 19.50125,-4.49875 z"
                  fill="#9c0000"
                />
                <Path
                  d="m 152.84589,349.19005 -18.75,4.5 -4.49875,-15.75 15.74875,-8.24875 z"
                  fill="#b50808"
                />
                <Path
                  d="m 143.84589,326.69005 -15,8.25 -11.99875,-8.25 11.25,-12.75 z"
                  fill="#c61818"
                />
                <Path
                  d="m 92.097143,311.69005 11.249997,13.5 h 10.49875 l 9.75125,-13.5 -9.75125,-3 h -10.7625 z"
                  fill="#ce3129"
                />
              </G>
            </Svg>
            <RalewayText
              weight="bold"
              style={{ color: "#ce3129", fontSize: 20, marginTop: 10 }}
            >
              Redmine-React
            </RalewayText>
          </View>
          <ReduxForm name="settingsForm">
            <Field
              name="url"
              type="text"
              label="Url de votre application"
              default={common.form.settingsForm.url}
            />
            <Text style={styles.note}>
              {
                "Veuillez noter que les suppressions sont accessibles uniquement avec une connexion sécurisée."
              }
            </Text>
            <Field
              name="api"
              type="text"
              label="Api utilisateur"
              default={common.form.settingsForm.api}
            />
            <Text style={styles.note}>
              {
                "Retrouvez votre clé d'accès API sur votre compte Redmine\rhttp://exemple.com/my/account."
              }
            </Text>
            <Field
              type="submit"
              disableOnSubmit={true}
              buttonStyle={{ backgroundColor: "#c97e7e" }}
              label="Enregistrer"
              onPress={formName => {
                if (common.form[formName].url.substr(-1) !== "/")
                  common.form[formName].url += "/";

                actions.setParameters("settings", common.form[formName]);
                AsyncStorage.setItem(
                  "@settings",
                  JSON.stringify(common.form[formName]),
                  () => {
                    delay(100).then(() => {
                      navigation.navigate("Login", { reload: true });
                    });
                  }
                );
              }}
            />
          </ReduxForm>
        </View>
      </View>
    );
  }
}

//export default LoginScreen;

const mapStateToProps = state => ({
  home: state.home,
  common: state.common,
  nav: state.nav
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...homeActions,
      ...commonActions
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstScreen);
