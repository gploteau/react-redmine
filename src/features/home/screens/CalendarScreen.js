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
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StackActions, NavigationActions } from "react-navigation";
import { HeaderTitle } from "@common.components";
import * as actions from "@home.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCC"
  },
  screenContainer: {
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
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  userPicture: {
    position: "absolute",
    width: 150,
    height: 150,
    top: 35,
    borderRadius: 20
  }
});

class CalendarScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <HeaderTitle title={appConfig.displayName} details="Mon calendrier" />
      ),
      headerStyle: {
        backgroundColor: appConfig.backgroundColor
      },
      headerLeft: (
        <Icon.Button
          title="Back"
          onPress={() => navigation.goBack()}
          margin={10}
          name="chevron-left"
          size={20}
          backgroundColor={null}
        />
      )
    };
  };

  render() {
    console.log("CalendarScreen render");
    const { actions, home, navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <Text style={styles.welcome}>Mon calendrier</Text>
        </View>
      </View>
    );
  }
}

//export default MainScreen;

const mapStateToProps = state => ({
  home: state.home,
  nav: state.nav
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarScreen);
