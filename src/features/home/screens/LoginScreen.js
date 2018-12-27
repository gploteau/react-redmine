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
import * as issuesActions from "@issues.redux/actions";
import * as projectActions from "@projects.redux/actions";
import * as othersActions from "@others.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { delay, debug } from "@common/helpers";
import Svg, { G, Path } from "react-native-svg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCC"
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
    fontFamily: "Raleway-Bold",
    fontSize: 26,
    textAlign: "center",
    margin: 10,
    marginBottom: 40,
    color: appConfig.backgroundColor
  }
});

const { width, height } = Dimensions.get("window");

const AnimatedPath = Animated.createAnimatedComponent(Path);

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.loaded = false;
  }

  runLogoAnimation(value) {
    this.animatedValue.setValue(value);
    Animated.timing(this.animatedValue, {
      toValue: value ? 0 : 150,
      duration: 500
    }).start(() => this.runLogoAnimation(value ? 0 : 150));
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.navigation.state.params !== "undefined" &&
      nextProps.navigation.state.params.reload == true
    ) {
      nextProps.navigation.state.params.reload = false;
      this._loadFeatures();
    }
  }

  _loadFeatures() {
    const { actions, navigation, common } = this.props;

    debug.trace("LoginScreen._loadFeatures", "Start AsyncStorage");

    AsyncStorage.getItem("@settings")
      .then(value => {
        debug.trace("LoginScreen._loadFeatures", "Get settings storage", value);
        if (!value) {
          navigation.navigate("First");
        } else {
          value = JSON.parse(value);

          if (!value.colors) {
            value.colors = appConfig.defaultColors;
            AsyncStorage.setItem("@settings", JSON.stringify(value));
          }
          actions.setParameters("settings", value);
          actions.setDefaultFormValue("settingsForm", value);

          actions.testApi(common.settings).then(() => {
            Promise.all([
              actions.getUser({ state: "currentUser", id: "current" }),
              actions.listUsers({ state: "users" }),
              actions.listIssues({
                state: "issuesAssignedToMe",
                filter: { assigned_to_id: "me" }
              }),
              actions.listIssues({
                state: "issuesAuthorMe",
                filter: { author_id: "me" }
              }),
              actions.listIssues({
                state: "issuesWatcherMe",
                filter: { watcher_id: "me" }
              }),
              actions.listProjects({ state: "projects" }),
              actions.listTrackers({ state: "trackers" }),
              actions.listQueries({ state: "queries" }),
              actions.listEnumerations({
                state: "issue_priorities",
                isEnum: true,
                enum: "issue_priorities"
              }),
              actions.listIssue_statuses({
                state: "issue_statuses"
              })
            ]).then(() => {
              navigation.navigate("Home", {
                title: "Accueil"
              });
            });
          });
        }
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    // TODO: check if user is logged

    const { actions, navigation, common } = this.props;
    //AsyncStorage.getAllKeys();

    this.runLogoAnimation(0);

    this._loadFeatures();
  }

  render() {
    const { actions, home, navigation } = this.props;

    const interpolateColor3 = this.animatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: ["#9c0000", "#c61818"]
    });

    const interpolateColor2 = this.animatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: ["#9c0000", "#b50808"]
    });

    const interpolateColor1 = this.animatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: ["#ce3129", "#9c0000"]
    });

    const interpolateColor0 = this.animatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: ["#9c0000", "#ce3129"]
    });

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7f1010" />
        <View style={styles.welcomeContainer}>
          <Svg height={100} width={100} viewBox="0 0 100 100">
            <G transform="translate(-59.847143,-308.69005)">
              <Path
                d="m 59.847143,374.6913 21,0 1.5,-18.00125 -19.50125,-4.49875 -2.99875,22.5 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 63.597143,349.19005 18.75,4.5 4.5,-15.75 -15.75,-8.24875 -7.5,19.49875 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 72.595893,326.69005 15,8.25 12.00125,-8.25 -11.25,-12.75 -15.75125,12.75 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 156.59589,374.6913 -20.99875,0 -1.50125,-18.00125 19.50125,-4.49875 2.99875,22.5 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 152.84589,349.19005 -18.75,4.5 -4.49875,-15.75 15.74875,-8.24875 7.5,19.49875 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 143.84589,326.69005 -15,8.25 -11.99875,-8.25 11.25,-12.75 15.74875,12.75 z"
                fill="#4c4c4c"
              />
              <Path
                d="m 92.097143,311.69005 11.249997,13.5 10.49875,0 9.75125,-13.5 -9.75125,-3 -10.7625,0 -10.986247,3 z"
                fill="#4c4c4c"
              />
              <AnimatedPath
                d="m 59.847143,374.6913 21,0 1.5,-18.00125 -19.50125,-4.49875 -2.99875,22.5 z"
                fill={interpolateColor1}
              />
              <AnimatedPath
                d="m 63.597143,349.19005 18.75,4.5 4.5,-15.75 -15.75,-8.24875 -7.5,19.49875 z"
                fill={interpolateColor2}
              />
              <AnimatedPath
                d="m 72.595893,326.69005 15,8.25 12.00125,-8.25 -11.25,-12.75 -15.75125,12.75 z"
                fill={interpolateColor3}
              />
              <AnimatedPath
                d="m 156.59589,374.6913 -20.99875,0 -1.50125,-18.00125 19.50125,-4.49875 2.99875,22.5 z"
                fill={interpolateColor1}
              />
              <AnimatedPath
                d="m 152.84589,349.19005 -18.75,4.5 -4.49875,-15.75 15.74875,-8.24875 7.5,19.49875 z"
                fill={interpolateColor2}
              />
              <AnimatedPath
                d="m 143.84589,326.69005 -15,8.25 -11.99875,-8.25 11.25,-12.75 15.74875,12.75 z"
                fill={interpolateColor3}
              />
              <AnimatedPath
                d="m 92.097143,311.69005 11.249997,13.5 10.49875,0 9.75125,-13.5 -9.75125,-3 -10.7625,0 -10.986247,3 z"
                fill={interpolateColor0}
              />
            </G>
          </Svg>
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
      ...commonActions,
      ...issuesActions,
      ...projectActions,
      ...othersActions
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
