// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import i18n from "@common/i18n";
import { identify } from "@common/helpers";
import {
  Alert,
  Platform,
  Text,
  View,
  Button,
  StatusBar,
  Switch,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as projectsActions from "@projects.redux/actions";
import * as commonActions from "@common.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderTitle, ReduxForm } from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";
import styles from "./styles/newProject";

class NewProjectScreen extends React.Component {
  render() {
    const { actions, common, navigation } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        style={styles.container}
      >
        <Text style={styles.welcome}>Nouveau projet</Text>
        <ReduxForm name="newProjectForm">
          <Field
            name="name"
            type="text"
            label="Titre"
            onValueChange={value => {
              actions.setFormValue(
                { name: "identifier", form: { name: "newProjectForm" } },
                value
              );
            }}
          />
          <Field name="identifier" type="text" label="Identifiant" />
          <Field
            name="description"
            type="text"
            label="Description"
            multiline={true}
            numberOfLines={3}
            canAddImage={true}
          />
          <Field name="is_public" type="switch" label="Public" />
          <Field
            type="submit"
            buttonStyle={{ backgroundColor: "#c97e7e" }}
            label={i18n.t("button.save")}
            onPress={formName =>
              actions
                .createProject({
                  state: "project",
                  filter: {
                    project: common.form[formName]
                  }
                })
                .then(() => {
                  actions.listProjects({
                    state: "projects",
                    filter: {}
                  });
                  navigation.goBack();
                })
                .catch(err => {
                  Alert.alert(
                    i18n.t("project.creation.project_not_created"),
                    i18n.t("project.creation." + identify(err[0])),
                    [
                      {
                        text: i18n.t("button.ok"),
                        onPress: () => console.log("OK Pressed")
                      }
                    ],
                    { cancelable: false }
                  );
                })
            }
          />
          <Field
            type="cancel"
            label={i18n.t("button.cancel")}
            onPress={() => navigation.goBack()}
          />
        </ReduxForm>
      </ScrollView>
    );
  }
}

//export default MainScreen;

const mapStateToProps = state => ({
  common: state.common
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...projectsActions, ...commonActions },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewProjectScreen);
