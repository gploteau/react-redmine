// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableNativeFeedback
} from "react-native";
import Moment from "moment";
import styles from "./styles/projectsList";
import { ViewFadeIn } from "@common.components";

const TouchableMainButton = props => (
  <ViewFadeIn>
    <TouchableNativeFeedback
      useForeground
      background={TouchableNativeFeedback.Ripple("#b77c7c")}
      onPress={() =>
        setTimeout(() => {
          props.nav.navigate("Project", { project_id: props.item.id });
        }, 0)
      }
    >
      <View style={styles.flatlistContainer} pointerEvents="box-only">
        <View style={{ flexDirection: "row", alignItems: "stretch" }}>
          <Text style={styles.rightZone} numberOfLines={2}>
            {props.item.name}
          </Text>
        </View>
        <Text style={styles.rightZoneButtonText} numberOfLines={5}>
          {props.item.description}
        </Text>
      </View>
    </TouchableNativeFeedback>
  </ViewFadeIn>
);

class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (typeof this.props.fetchData === "function")
      this.props.fetchData().then(() => {
        this.setState({ refreshing: false });
      });
    else this.setState({ refreshing: false });
  };

  render() {
    const { navigation } = this.props;

    return (
      <FlatList
        {...this.props}
        contentContainerStyle={styles.screenContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        renderItem={({ item }) => {
          Moment.locale("en");

          const formatedDate =
            Moment(item.created_on).format("DD/MM/YYYY") +
            " à " +
            Moment(item.created_on).format("HH:mm");

          return <TouchableMainButton item={item} nav={navigation} />;
        }}
      />
    );
  }
}

ProjectsList.propTypes = {
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default ProjectsList;
