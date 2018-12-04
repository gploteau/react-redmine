// @flow
"use strict";

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screenContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingBottom: 10
  },
  flatlistContainer: {
    backgroundColor: "#fff",
    borderRadius: 7,
    borderLeftWidth: 5,
    height: 90,
    borderLeftColor: "#000",
    borderBottomRightRadius: 0
  },
  instructions: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 17,
    margin: 8
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "red"
  },
  rightZone: {
    justifyContent: "flex-end",
    margin: 10,
    paddingLeft: 80,
    marginRight: 30,
    fontFamily: "Raleway-Bold",
    fontSize: 15,
    marginLeft: "auto",
    textAlign: "left"
  },
  rightZoneButtonText: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 14,
    padding: 8
  },
  status: {
    color: "#333333",
    fontFamily: "Raleway-Regular",
    fontSize: 15,
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginTop: 10
  },
  itemContainer: { padding: 10, paddingLeft: 20 }
});
