// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import { ScrollView } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as actions from "@common.redux/actions";

class Form extends Component {
  _setFieldValue = e => {
    console.log(this.props.name, e);
  };

  _returnChildren = () => this._getFields(this.props.children);

  _getFields = children => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        ref: `child${index}`,
        parent: this,
        actions: this.props.actions,
        autoSubmit: this.props.autoSubmit
      });
    });
  };

  render() {
    const children = this._getFields(this.props.children);

    return (
      <ScrollView keyboardShouldPersistTaps={"handled"}>{children}</ScrollView>
    );
  }
}

Form.propTypes = { name: PropTypes.string.isRequired };

const mapStateToProps = state => ({
  common: state.common
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
