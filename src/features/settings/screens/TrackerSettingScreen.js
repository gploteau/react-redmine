// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  StatusBar,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as actions from "@common.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderTitle, ReduxForm } from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";
import { calls, delay, debug } from "@common/helpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCC"
  },
  screenContainer: {
    flex: 1,
    padding: 10
  },
  welcome: {
    fontFamily: "Raleway-Bold",
    fontSize: 26,
    textAlign: "center",
    margin: 10,
    marginBottom: 40,
    color: appConfig.backgroundColor
  },
  title: {
    fontFamily: "Raleway-Regular",
    margin: 15,
    fontSize: 20
  }
});

class TrackerSettingScreen extends Component {
  render() {
    const { actions, home, navigation, common, others } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <ReduxForm
            name="trackerSettingsForm"
            autoSubmit={formName => {
              AsyncStorage.mergeItem(
                "@settings",
                JSON.stringify({
                  colors: { trackers: common.form[formName] }
                })
              ).then(() =>
                AsyncStorage.getItem("@settings", (err, result) => {
                  if (result) {
                    actions.setParameters("settings", JSON.parse(result));
                  }
                })
              );
            }}
          >
            <Text style={styles.title}>Couleurs des trackers</Text>
            {others.trackers.trackers ? (
              others.trackers.trackers
                .filter(item => item.id != 0)
                .map(item => {
                  return (
                    <Field
                      key={item.id}
                      text={item.name}
                      name={item.id}
                      type="color"
                      default={calls(
                        common.settings.colors.trackers[item.id],
                        "#000"
                      )}
                    />
                  );
                })
            ) : (
              <Text>Aucun données</Text>
            )}
          </ReduxForm>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  home: state.home,
  common: state.common,
  others: state.others
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackerSettingScreen);
