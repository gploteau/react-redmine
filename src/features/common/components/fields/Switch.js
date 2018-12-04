// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import { View, Text, StyleSheet, Switch as RNSwitch } from "react-native";

const styles = StyleSheet.create({
  buttonLabel: {
    color: "#333",
    fontFamily: "Raleway-Bold",
    marginTop: 5,
    paddingLeft: 9,
    fontSize: 18
  },
  button: {
    padding: 20,
    margin: 10,
    backgroundColor: "#AAA",
    justifyContent: "center",
    alignItems: "center"
  }
});

class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  _onChange = value => {
    this.setState({ value });
    if (typeof this.props.onChangeValue === "function")
      this.props.onChangeValue(value);
  };

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 17,
          paddingBottom: 17
        }}
      >
        <Text style={[styles.buttonLabel]}>{this.props.label}</Text>
        <RNSwitch onValueChange={this._onChange} value={this.state.value} />
      </View>
    );
  }
}

Switch.propTypes = {};

export default Switch;
