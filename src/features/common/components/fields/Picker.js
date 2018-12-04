// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  Modal,
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Animated,
  Easing,
  StatusBar
} from "react-native";
import { debug } from "@common/helpers";

const styles = StyleSheet.create({
  buttonLabel: {
    color: "#333",
    fontFamily: "Raleway-Bold"
  },
  buttonTextCancel: {
    color: "#A33",
    fontFamily: "Raleway-Bold"
  },
  button: {
    padding: 12,
    margin: 10,
    marginTop: 0,
    backgroundColor: "#AAA",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonCancel: {
    backgroundColor: "#DDD"
  },
  picker: {
    flex: 1,
    justifyContent: "flex-end",
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    backgroundColor: "rgba(50,50,50,0.5)"
  }
});

class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: this.props.selectedValue || "",
      textValue: "",
      bounceValue: new Animated.Value(100)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedValue !== this.props.selectedValue) {
      debug.trace(
        "Picker.componentDidUpdate selectedValue props change",
        this.props.selectedValue
      );
      this.setState({ value: this.props.selectedValue });
    }
  }

  setValue(value, text) {
    debug.trace("Picker.setValue", value);
    if (typeof this.props.onValueChange === "function")
      this.props.onValueChange(value);
    this.state.value = value;
    this.setModalVisible(false);
  }

  _handleReset() {
    debug.trace("Picker._handleReset");
    if (typeof this.props.onValueChange === "function")
      this.props.onValueChange("");
    this.state.value = "";
  }

  setModalVisible(visible) {
    let toValue = 0;

    if (!visible) toValue = 100;
    else this.setState({ modalVisible: visible });

    Animated.timing(this.state.bounceValue, {
      toValue: toValue,
      delay: 100,
      easing: Easing.elastic(1)
    }).start(e => {
      if (!visible) this.setState({ modalVisible: visible });
    });
  }

  render() {
    this.state.textValue = "";

    const children = React.Children.map(this.props.children, (child, index) => {
      if (child.props.value == this.state.value)
        this.state.textValue = child.props.label;
      return React.cloneElement(child, {
        parent: this,
        actions: this.props.actions
      });
    });

    if (this.state.textValue == "") this.state.value = 0;

    const translateY = this.state.bounceValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 350]
    });

    return (
      <View>
        <Modal
          onPress={e => console.log(e)}
          presentationStyle="overFullScreen"
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor={"#7f1010"} />
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flex: 1,
              backgroundColor: "rgba(50,50,50,0.4)"
            }}
            onPress={() => {
              this.setModalVisible(false);
            }}
          >
            <Animated.View
              style={{
                top: "40%",
                height: "60%",
                paddingTop: 10,
                backgroundColor: "#EEE",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                transform: [{ translateY }]
              }}
            >
              <ScrollView>{children}</ScrollView>

              <TouchableOpacity
                style={[
                  styles.button,
                  this.props.buttonStyle,
                  styles.buttonCancel
                ]}
                {...this.props}
                onPress={() => {
                  this.setModalVisible(false);
                }}
              >
                <Text style={styles.buttonTextCancel}>Annuler</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={[styles.button, this.props.buttonStyle]}
          {...this.props}
          onPress={() => {
            this.setModalVisible(true);
          }}
          onLongPress={() => (this.props.canReset ? this._handleReset() : null)}
        >
          <Text style={styles.buttonLabel}>
            {this.state.textValue || "Sélectionnez"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class Item extends Component {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    this.props.parent.setValue(this.props.value, this.props.label);
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.buttonStyle]}
        {...this.props}
        onPress={this._onPress}
      >
        <Text style={styles.buttonLabel}>{this.props.label}</Text>
      </TouchableOpacity>
    );
  }
}

Picker.propTypes = {};

Picker.Item = Item;

export default Picker;
