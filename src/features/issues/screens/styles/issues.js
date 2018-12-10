// @flow
"use strict";

import { StyleSheet } from "react-native";
import appConfig from "@src/app.json";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 56,
    backgroundColor: "#333"
  },
  welcome: {
    fontFamily: "Raleway-Bold",
    fontSize: 22,
    textAlign: "center",
    margin: 10,
    marginBottom: 20,
    color: appConfig.backgroundColor
  },
  bottomMenuContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20, 20, 20, 0.5)",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomMenuCloseButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 5,
    borderTopRightRadius: 10
  },
  bottomMenuFiltersContainer: {
    marginLeft: "auto",
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: appConfig.backgroundColor,
    borderTopLeftRadius: 10
  },
  bottomMenuFiltersText: {
    color: "#EEE",
    fontFamily: "Raleway-Bold",
    fontSize: 18
  },
  bottomMenuFiltersTextDetails: {
    color: "#AAA",
    fontFamily: "Raleway-Bold",
    fontSize: 13
  },
  linearGradientView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  linearGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15
  }
});
