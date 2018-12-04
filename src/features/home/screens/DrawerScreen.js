// @flow
"use strict";

import React, { Component } from "react";
import appConfig from "@src/app.json";
import { StyleSheet } from "react-native";
import { DrawerItems, SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { ScrollView, Text, View } from "react-native";
import { DrawerActions } from "react-navigation";
import * as actions from "@home.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";
import { HeaderTitle } from "@common.components";

const styles = StyleSheet.create({
  container: { paddingTop: 25 }
});

const CustomHeaderButton = props => (
  <Icon.Button {...props} size={30} backgroundColor={null} />
);

class DrawerScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: "always", horizontal: "never" }}
          >
            <DrawerItems
              {...this.props}
              items={this.props.items.filter(
                item =>
                  item.routeName !== "Login" &&
                  item.routeName !== "Issue" &&
                  item.routeName !== "Project" &&
                  item.routeName !== "Issues"
              )}
            />
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

export default DrawerScreen;
