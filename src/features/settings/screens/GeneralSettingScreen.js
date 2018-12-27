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
import { delay, debug } from "@common/helpers";

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
  note: {
    fontFamily: "Raleway-Regular",
    fontSize: 12,
    margin: 5,
    color: "#222"
  }
});

class GeneralSettingScreen extends React.Component {
  render() {
    const { actions, home, navigation, common } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.screenContainer}>
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

//export default MainScreen;

const mapStateToProps = state => ({
  home: state.home,
  common: state.common
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralSettingScreen);
