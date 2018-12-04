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
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as projectActions from "@projects.redux/actions";
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
      removeAndroidBackButtonHandler();
      handleAndroidBackButton(() => navigation.navigate("Projects"));
    }

    actions.clearProject();
    actions.getProject({
      state: "project",
      id: this.props.navigation.state.params.project_id
    });
  }
  render() {
    const { actions, project, navigation, common } = this.props;

    let contents = project ? project.description : "";

    return (
      <View style={styles.container}>
        {common.isLoading ? (
          <Preloader active={true} />
        ) : (
          <ScrollView style={styles.screenContainer}>
            <Text style={styles.title}>{project ? project.name : ""}</Text>
            <Text style={styles.description}>{contents}</Text>
          </ScrollView>
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
  actions: bindActionCreators({ ...projectActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectScreen);
