// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Modal, View, Text, StyleSheet } from "react-native";
import { debug } from "@common/helpers";

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

class Preloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: props.active
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidUpdate(prevProps, prevState) {
    debug.trace("Preloader.componentDidUpdate", prevProps);
    // if (prevProps.active !== this.state.modalVisible)
    //   this.setState({ modalVisible: prevProps.active });
  }

  render() {
    const { active } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
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
          <ActivityIndicator size={70} color="#7f1010" />
        </View>
      </Modal>
    );
  }
}

Preloader.propTypes = {
  active: PropTypes.bool.isRequired
};

export default Preloader;
