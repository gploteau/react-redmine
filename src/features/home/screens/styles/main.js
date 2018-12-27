// @flow
"use strict";

import { StyleSheet } from "react-native";
import appConfig from "@src/app.json";

export default StyleSheet.create({
  wrapper: {},
  container: {
    flex: 1,
    paddingTop: 56,
    backgroundColor: "#CCC"
  },
  slide: {
    flex: 1
  },
  screenContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch"
  },
  flatlistContainer: {
    height: 75,
    backgroundColor: "#fff",
    borderRadius: 7,
    borderLeftWidth: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftColor: "#C20E0E"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  rightZoneButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 59,
    borderColor: "#C20E0E",
    borderWidth: 3,
    alignItems: "center",
    borderRadius: 7,
    margin: 8
  },
  rightZoneButtonText: {
    color: "#C20E0E",
    textAlign: "center",
    fontFamily: "Raleway-Bold",
    fontSize: 20
  },
  issues_details: {
    color: appConfig.backgroundColor,
    fontSize: 19
  },
  welcome: {
    fontFamily: "Raleway-Bold",
    fontSize: 23,
    margin: 10,
    height: 40,
    marginBottom: 20,
    color: appConfig.backgroundColor
  },
  instructions: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 15,
    margin: 10,
    flex: 3.5,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  h4: {
    color: "#333333",
    fontFamily: "Raleway-Bold",
    fontSize: 15,
    margin: 10
  },
  link: {
    color: appConfig.backgroundColor,
    fontSize: 17,
    margin: 0
  },
  linkButton: {
    borderColor: appConfig.backgroundColor,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginBottom: 5
  },
  messageBox: {
    backgroundColor: "#ef553a",
    width: 300,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10
  },
  messageBoxTitleText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10
  },
  messageBoxBodyText: {
    color: "#fff",
    fontSize: 16
  },
  newEventText: {
    fontFamily: "Raleway-Bold",
    fontSize: 20,
    color: "#FA5955"
  },
  welcomeContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 999,
    backgroundColor: "rgba(50,50,50,0.5)",
    justifyContent: "center",
    alignItems: "center"
  }
});
