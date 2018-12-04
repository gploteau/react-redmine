// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  buttonLabel: {
    color: "#333",
    fontFamily: "Raleway-Bold"
  },
  button: {
    padding: 20,
    margin: 10,
    backgroundColor: "#AAA",
    justifyContent: "center",
    alignItems: "center"
  }
});

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: false };
  }

  _onPress = () => {
    if (this.props.disableOnSubmit) this.setState({ disabled: true });

    if (typeof this.props.onPress === "function")
      this.props.onPress(this.props.parent.props.name);
  };

  reenable = () => {
    this.setState({ disabled: false });
  };

  render() {
    return (
      <TouchableOpacity
        disabled={this.state.disabled}
        style={[
          styles.button,
          this.props.buttonStyle,
          this.state.disabled ? { backgroundColor: "#BBB" } : {}
        ]}
        {...this.props}
        onPress={this._onPress}
      >
        <Text style={styles.buttonLabel}>{this.props.label}</Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {};

export default Button;
