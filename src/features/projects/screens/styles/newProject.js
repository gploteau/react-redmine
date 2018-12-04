// @flow
"use strict";

import { StyleSheet } from "react-native";
import appConfig from "@src/app.json";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#CCC"
  },
  welcome: {
    fontFamily: "Raleway-Bold",
    fontSize: 22,
    textAlign: "center",
    margin: 10,
    marginBottom: 20,
    color: appConfig.backgroundColor
  },
  labelBigText: {
    marginTop: 5,
    paddingLeft: 9,
    fontFamily: "Raleway-Bold",
    fontSize: 18
  },
  labelText: {
    marginTop: 5,
    paddingLeft: 9,
    fontFamily: "Raleway-Bold",
    fontSize: 14
  },
  textInput: {
    fontFamily: "Raleway-Bold",
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  },
  labelInput: {
    color: "#333",
    fontFamily: "Raleway-Bold"
  },
  formInput: {
    borderBottomWidth: 1.5,
    borderColor: "#333"
  },
  input: {
    borderWidth: 0
  },
  button: {},
  text: {},
  picker: {
    height: 40
  },
  pickerItem: {
    color: "#333",
    fontFamily: "Raleway-Bold",
    fontSize: 18
  }
});
