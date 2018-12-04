// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import i18n from "@common/i18n";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import Moment from "moment";

const styles = StyleSheet.create({
  labelInput: {
    color: "#333",
    fontFamily: "Raleway-Bold"
  },
  dateTimeButton: {
    padding: 20,
    margin: 10,
    marginTop: 0,
    height: 40,
    backgroundColor: "#AAA",
    justifyContent: "center",
    alignItems: "center"
  }
});

class DateTimePickerField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: i18n.t("date_format"),
      isDateTimePickerVisible: false
    };
  }

  render() {
    const { selectedDate, isDateTimePickerVisible } = this.state;

    return (
      <View {...this.props}>
        <TouchableOpacity
          onPress={this._showDateTimePicker}
          onLongPress={this._handleReset}
        >
          <View style={styles.dateTimeButton}>
            <Text style={styles.labelInput}>{selectedDate}</Text>
          </View>
        </TouchableOpacity>

        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.setState({ selectedDate: Moment(date).format("DD/MM/YYYY") });
    if (typeof this.props.onChange === "function")
      this.props.onChange(
        Moment(date).format(
          this.props.format ? this.props.format : "DD/MM/YYYY"
        )
      );
    this._hideDateTimePicker();
  };

  _handleReset = () => {
    this.setState({ selectedDate: i18n.t("date_format") });
    if (typeof this.props.onChange === "function") this.props.onChange("");
    this._hideDateTimePicker();
  };
}

DateTimePickerField.propTypes = {};

export default DateTimePickerField;
