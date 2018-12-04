// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableNativeFeedback,
  Animated
} from "react-native";
import { ViewFadeIn } from "@common.components";
import Moment from "moment";
import styles from "./styles/refreshableList";

class TouchableMainButton extends Component {
  state = {
    scaleAnim: new Animated.Value(1)
  };

  render() {
    const { props, state } = this;

    return (
      <View style={{ flex: 1, marginTop: 10, margin: 10, marginBottom: 0 }}>
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple("#b77c7c")}
          onPress={e => {
            setTimeout(() => {
              props.nav.navigate("Issue", {
                issue_id: props.item.id,
                req: props.nav.state.params ? props.nav.state.params.req : null,
                indexKey: props.indexKey
              });
            }, 0);
            // Animated.spring(
            //   // Animate over time
            //   state.scaleAnim, // The animated value to drive
            //   {
            //     toValue: 1.1 // Animate to opacity: 1 (opaque)
            //   }
            // ).start();
          }}
        >
          <Animated.View
            pointerEvents="box-only"
            style={
              {
                // transform: [
                //   {
                //     scale: state.scaleAnim
                //   }
                // ]
              }
            }
          >
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderRightWidth: 40,
                borderTopWidth: 40,
                borderRightColor: "transparent",
                borderTopColor:
                  props.options.colors.priorities[props.item.priority.id],
                zIndex: 999,
                transform: [{ rotate: "90deg" }]
              }}
            />
            <View
              style={[
                styles.flatlistContainer,
                {
                  // backgroundColor:
                  //   props.options.colors.priorities[props.item.priority.id],
                  borderLeftColor:
                    props.options.colors.trackers[props.item.tracker.id]
                }
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "stretch" }}>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.instructions}>#{props.item.id}</Text>
                  <Text style={styles.status}>{props.item.status.name}</Text>
                  <Text style={[styles.status, { marginTop: 2 }]}>
                    {props.item.assigned_to
                      ? "Assignée à " + props.item.assigned_to.name
                      : "Non assignée"}
                  </Text>
                </View>
                <Text style={styles.rightZone} numberOfLines={2}>
                  {props.item.subject}
                </Text>
              </View>
              {/* <Text style={styles.rightZoneButtonText} numberOfLines={5}>
            {props.item.description}
          </Text> */}
            </View>
          </Animated.View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

class RefreshableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      currentContentOffsetY: 0,
      initialScrollIndex: 0
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
    const { navigation, options } = this.props;
    const { params } = navigation.state;

    return (
      <FlatList
        {...this.props}
        style={{ flex: 1 }}
        removeClippedSubviews={true}
        //initialScrollIndex={params.scrollIndex || 0}
        showsVerticalScrollIndicator={false}
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

          return (
            <TouchableMainButton
              indexKey={parseInt(item.key)}
              item={item}
              options={options}
              nav={navigation}
            />
          );
        }}
      />
    );
  }
}

RefreshableList.propTypes = {
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default RefreshableList;
