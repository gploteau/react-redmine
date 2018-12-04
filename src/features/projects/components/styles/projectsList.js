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
    marginTop: 10,
    borderRadius: 7,
    borderLeftWidth: 5,
    borderLeftColor: "#000"
  },
  Anomalie: {
    borderLeftColor: "#C20E0E"
  },
  Evolution: {
    borderLeftColor: "#85C049"
  },
  Assistance: {
    borderLeftColor: "#63A7F5"
  },
  instructions: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 17,
    margin: 8
  },
  rightZone: {
    justifyContent: "flex-end",
    margin: 10,
    fontFamily: "Raleway-Bold",
    fontSize: 15,
    textAlign: "left"
  },
  rightZoneButtonText: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 14,
    padding: 8
  },
  itemContainer: { padding: 10, paddingLeft: 20 }
});
