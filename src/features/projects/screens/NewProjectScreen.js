// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import i18n from "@common/i18n";
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  getObjProp,
  identify,
  debug
} from "@common/helpers";
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
  state = {
    identifier: ""
  };
  componentDidMount() {
    //global.notif.scheduleNotif();
    const { actions, navigation } = this.props;
    const { params } = navigation.state;

    const project = params ? params.project : null;

    if (project) actions.setDefaultFormValue("newProjectForm", project);
    else actions.clearForm("newProjectForm");

    if (Platform.OS === "android") {
      removeAndroidBackButtonHandler();
      handleAndroidBackButton(() => navigation.navigate("Projects"));
    }
  }

  render() {
    const { actions, common, navigation } = this.props;
    const { params } = navigation.state;

    const project = params ? params.project : null;

    console.log(project);

    const identifierFormated = this.state.identifier
      .replace(/(\s)+/g, "-")
      .toLowerCase();

    return (
      <View keyboardShouldPersistTaps={"handled"} style={styles.container}>
        <Text style={styles.welcome}>
          {i18n.t("project." + (project ? "modify" : "new"))}
        </Text>
        <ReduxForm name="newProjectForm">
          <Field
            name="name"
            type="text"
            label="Titre"
            default={project ? project.name : ""}
            onValueChange={value => {
              this.setState({ identifier: value });
              actions.setFormValue(
                { name: "identifier", form: { name: "newProjectForm" } },
                value
              );
            }}
          />
          <Field
            name="identifier"
            type="text"
            label="Identifiant"
            default={project ? project.identifier : ""}
            forceValue={identifierFormated}
          />
          <Field
            name="description"
            type="text"
            label="Description"
            default={project ? project.description : ""}
            multiline={true}
            numberOfLines={3}
          />
          <Field
            name="is_public"
            type="switch"
            label="Public"
            value={project ? project.is_public : true}
          />
          <Field
            type="submit"
            buttonStyle={{ backgroundColor: "#c97e7e" }}
            label={i18n.t("button.save")}
            onPress={formName => {
              const updateOrCreateProject = () =>
                project
                  ? actions
                      .updateProject({
                        id: project.id,
                        filter: {
                          project: common.form[formName]
                        }
                      })
                      .then(() => {
                        debug.trace("NewProjectScreen updateProject.then");
                        actions.getProject({
                          state: "project",
                          id: project.id
                        });
                        navigation.goBack();
                      })
                  : actions
                      .createProject({
                        state: "project",
                        filter: {
                          project: common.form[formName]
                        }
                      })
                      .then(() => {
                        debug.trace("NewProjectScreen createProject.then");
                        actions.listProjects({
                          state: "projects",
                          filter: {}
                        });
                        navigation.goBack();
                      });

              updateOrCreateProject().catch(err => {
                debug.trace("NewProjectScreen createProject.catch", err);
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
              });
            }}
          />
          <Field
            type="cancel"
            label={i18n.t("button.cancel")}
            onPress={() => navigation.goBack()}
          />
        </ReduxForm>
      </View>
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
