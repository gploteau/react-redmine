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
  Image,
  View,
  Button,
  StatusBar,
  Picker,
  PickerIOS,
  Switch,
  TouchableOpacity,
  Slider,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as issuesActions from "@issues.redux/actions";
import * as projectsActions from "@projects.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderTitle, ReduxForm } from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";
import styles from "./styles/newIssue";

class NewIssueScreen extends Component {
  state = {
    defaultStatusId: 1,
    currentProjectCategories: []
  };
  componentWillUnMount() {
    removeAndroidBackButtonHandler();
  }

  componentDidMount() {
    const { navigation } = this.props;

    if (Platform.OS === "android") {
      removeAndroidBackButtonHandler();
      handleAndroidBackButton(() => navigation.goBack());
    }
  }
  render() {
    const { actions, home, navigation, common, projects, others } = this.props;

    debug.trace("NewIssueScreen", projects.issue_categories);

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{i18n.t("new_issue")}</Text>
        <ReduxForm name="newIssueForm">
          <Field
            name="project_id"
            type="select"
            label="Projet"
            default={1}
            data={getObjProp(projects.projects, "projects", [])}
            navigation={this.props.navigation}
            onValueChange={v => {
              actions.listProjects({
                state: "issue_categories",
                isEnum: true,
                enum: v + "/issue_categories"
              });
            }}
          />
          <Field
            name="tracker_id"
            type="select"
            label="Tracker"
            default={1}
            data={getObjProp(others.trackers, "trackers", [])}
            navigation={this.props.navigation}
            onValueChange={v => {
              others.trackers.trackers.map(tracker => {
                if (tracker.id == v) {
                  debug.trace(
                    "tracker_id.onValueChange",
                    tracker.default_status.id
                  );
                  this.setState({ defaultStatusId: tracker.default_status.id });
                }
              });
            }}
          />
          <Field
            name="status_id"
            type="select"
            label="Statut"
            forceValue={this.state.defaultStatusId}
            default={this.state.defaultStatusId}
            data={getObjProp(others.issue_statuses, "issue_statuses", [])}
            navigation={this.props.navigation}
          />
          <Field
            name="priority_id"
            type="select"
            label="Priorité"
            default={2}
            data={getObjProp(others.issue_priorities, "issue_priorities", [])}
            navigation={this.props.navigation}
          />
          <Field name="subject" type="text" label="Sujet" />
          <Field
            name="description"
            type="text"
            label="Description"
            multiline={true}
            numberOfLines={3}
            canAddImage={true}
          />
          <Field
            name="category_id"
            type="select"
            label="Catégorie"
            default={0}
            data={getObjProp(projects.issue_categories, "issue_categories", [])}
            navigation={this.props.navigation}
            addNoneItem={true}
            feminin={true}
          />
          <Field.Group>
            <Field
              name="start_date"
              type="datetime"
              label="Début"
              format="YYYY-MM-DD"
            />
            <Field
              name="due_date"
              type="datetime"
              label="Echéance"
              format="YYYY-MM-DD"
            />
          </Field.Group>
          <Field
            name="assigned_to_id"
            type="select"
            label="Assigné à"
            data={getObjProp(home.users, "users", [])}
            itemLabel={item => item.firstname + " " + item.lastname}
            navigation={this.props.navigation}
            addNoneItem={true}
          />
          <Field
            type="submit"
            buttonStyle={{ backgroundColor: "#c97e7e" }}
            label="Créer"
            onPress={formName => {
              if (!common.form[formName].subject) {
                Alert.alert(
                  i18n.t("issue.creation.issue_not_created"),
                  i18n.t("issue.creation.issue_need_subject"),
                  [
                    {
                      text: i18n.t("button.ok"),
                      onPress: () => console.log("OK Pressed")
                    }
                  ],
                  { cancelable: false }
                );
                return;
              }

              const createIssue = () =>
                actions
                  .createIssue({
                    filter: {
                      issue: common.form[formName]
                    }
                  })
                  .then(() => {
                    actions.listIssues({
                      state: "issuesAuthorMe",
                      filter: { author_id: "me" }
                    });
                    navigation.goBack();
                  })
                  .catch(err => {
                    Alert.alert(
                      i18n.t("issue.creation.issue_not_created"),
                      i18n.t("issue.creation." + identify(err[0])),
                      [
                        {
                          text: i18n.t("button.ok"),
                          onPress: () => console.log("OK Pressed")
                        }
                      ],
                      { cancelable: false }
                    );
                  });

              if (common.uploads.length) {
                const uploadFileLoop = int => {
                  actions
                    .uploadFile({
                      form: formName,
                      file: common.uploads[int]
                    })
                    .then(() => {
                      if (int > 0) uploadFileLoop(int - 1);
                      else createIssue();
                    });
                };
                uploadFileLoop(common.uploads.length - 1);
              } else {
                createIssue();
              }
            }}
          />
          <Field
            type="cancel"
            label="Annuler"
            onPress={() => navigation.goBack()}
          />
        </ReduxForm>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  home: state.home,
  common: state.common,
  others: state.others,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...projectsActions, ...issuesActions },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewIssueScreen);
