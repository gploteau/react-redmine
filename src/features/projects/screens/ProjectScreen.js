// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler
} from "@common/helpers";
import {
  Platform,
  Text,
  Image,
  View,
  Button,
  StatusBar,
  ScrollView,
  Alert,
  TouchableNativeFeedback
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as projectActions from "@projects.redux/actions";
import * as commonActions from "@common.redux/actions";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/FontAwesome";
import { HeaderTitle, Preloader } from "@common.components";
import { ProjectsList } from "@home.components";
import styles from "./styles/project";

class ProjectScreen extends React.Component {
  componentWillUnMount() {
    removeAndroidBackButtonHandler();
  }
  componentDidMount() {
    //global.notif.scheduleNotif();
    const { actions, navigation } = this.props;

    if (Platform.OS === "android") {
      handleAndroidBackButton(() => navigation.navigate("Projects"));
    }

    actions.clearProject();
    actions.getProject({
      state: "project",
      id: navigation.state.params.project_id
    });

    if (typeof navigation.setParams === "function")
      navigation.setParams({
        popupMenu: {
          Modifier: this.modifyProject,
          Supprimer: () =>
            Alert.alert(
              "Confirmation de suppression",
              "Vous êtes sur le point de supprimer définitivement ce project." +
                "\r\nÊtes-vous sûr de vouloir continuer ?",
              [
                {
                  text: "Oui",
                  onPress: () =>
                    actions
                      .deleteProject({
                        id: navigation.state.params.project_id
                      })
                      .then(() =>
                        actions
                          .listProjects({
                            state: "projects",
                            filter: {}
                          })
                          .then(() => navigation.navigate("Projects"))
                      )
                },
                { text: "Non", style: "cancel" }
              ]
            )
        }
      });
  }

  modifyProject = () => {
    const { actions, navigation, project } = this.props;
    const { params } = navigation.state;

    actions.setDefaultFormValue("newProjectForm", project);

    navigation.navigate("NewProject", { project: project });
  };

  render() {
    const { actions, project, navigation, common } = this.props;

    let contents = project ? project.description : "";

    return (
      <View style={styles.container}>
        {common.isLoading ? (
          <Preloader active={true} />
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.screenContainer}>
              <Text style={styles.title}>{project ? project.name : ""}</Text>
              <Text style={styles.description}>{contents}</Text>
              <TouchableNativeFeedback
                useForeground
                onPress={() =>
                  setTimeout(() => {
                    navigation.navigate("Issues", {
                      req: {
                        state: "issues",
                        filter: { project_id: project.id }
                      },
                      backScreen: {
                        screen: "Project",
                        params: { project_id: project.id }
                      },
                      hideFilters: false,
                      backSwiperIndex: 0,
                      scrollIndex: 0
                    });
                  }, 0)
                }
                background={TouchableNativeFeedback.Ripple("#AAA")}
              >
                <View style={styles.linkButton}>
                  <Text style={[styles.h4, styles.link]}>
                    Voir les demandes
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </ScrollView>
            <ActionButton
              buttonColor={appConfig.backgroundColor}
              fixNativeFeedbackRadius={true}
              offsetX={23}
              offsetY={27}
              onPress={() =>
                navigation.navigate("NewIssue", { project_id: project.id })
              }
            />
          </View>
        )}
      </View>
    );
  }
}

//export default MainScreen;

const mapStateToProps = state => ({
  common: state.common,
  project: state.projects.project ? state.projects.project.project : {}
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...projectActions, ...commonActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectScreen);
