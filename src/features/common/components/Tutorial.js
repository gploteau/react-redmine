// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { debug } from "@common/helpers";
import { Cross } from "@common.components.svg";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Raleway-Bold",
    fontSize: 26,
    color: "#fff",
    left: 10
  },
  details: {
    fontFamily: "Raleway-Bold",
    fontSize: 10,
    color: "#fff",
    left: 10
  }
});

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: props.active
    };
  }

  setModalVisible(visible) {
    debug.trace("Tutorial.setModalVisible", visible);
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    debug.trace("Tutorial.componentDidMount");
    // if (prevProps.active !== this.state.modalVisible)
    //   this.setState({ modalVisible: prevProps.active });
  }

  render() {
    const { active } = this.props;

    if (!this.state.modalVisible) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)"
          }}
        >
          <View style={{ position: "absolute", top: 25, right: 25 }}>
            <TouchableOpacity
              useForeground
              onPress={() => {
                this.setModalVisible(false);
              }}
            >
              <Cross />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

Tutorial.propTypes = {
  active: PropTypes.bool.isRequired
};

export default Tutorial;
