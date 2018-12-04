// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";
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

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

class ImageAutoSize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flex: 1,
      width: 1,
      height: 1
    };
  }

  componentDidUpdate(prevProps, prevState) {
    debug.trace("ImageAutoSize.componentDidUpdate", prevProps);
    // if (prevProps.active !== this.state.modalVisible)
    //   this.setState({ modalVisible: prevProps.active });
  }

  componentDidMount() {
    Image.getSize(
      this.props.source,
      (width, height) => {
        this.setState({ width, height });
      },
      err => {
        console.log(err);
      }
    );
  }

  render() {
    let windowWidth = Dimensions.get("window").width - 20;
    return this.props.source ? (
      <Image
        source={{ uri: this.props.source }}
        style={{
          flex: 1,
          width: windowWidth,
          height: (windowWidth * this.state.height) / this.state.width
        }}
      />
    ) : null;
  }
}

ImageAutoSize.propTypes = {};

export default ImageAutoSize;
