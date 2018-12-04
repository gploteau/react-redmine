// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  default: {
    fontFamily: "Raleway-Regular",
    fontSize: 14
  }
});

const RalewayText = props => {
  let definedWeight = "";
  const weights = [
    "Bold",
    "Black",
    "BlackItalic",
    "BoldItalic",
    "ExtraBold",
    "ExtraBoldItalic",
    "ExtraLight",
    "ExtraLightItalic",
    "Italic",
    "Light",
    "LightItalic",
    "Medium",
    "MediumItalic",
    "Regular",
    "SemiBold",
    "SemiBoldItalic",
    "Thin",
    "ThinItalic"
  ];

  if (props.weight)
    weights.map(w => {
      if (w.toLowerCase() == props.weight.toLowerCase()) definedWeight = w;
    });

  return (
    <Text
      style={[
        styles.default,
        props.style,
        definedWeight ? { fontFamily: "Raleway-" + definedWeight } : {}
      ]}
    >
      {props.children}
    </Text>
  );
};

RalewayText.propTypes = {
  weight: PropTypes.string
};

export default RalewayText;
