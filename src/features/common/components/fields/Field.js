// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import i18n from "@common/i18n";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ReactContext
} from "react-native";
import ImagePicker from "react-native-image-picker";
import FloatingLabel from "./FloatingLabel";
import Button from "./Button";
import DateTimePickerField from "./DateTimePickerField";
import Picker from "./Picker";
import Switch from "./Switch";
import ColorPicker from "./ColorPicker";
import { debug } from "@common/helpers";

const styles = StyleSheet.create({
  input: {
    borderWidth: 0
  },
  labelInput: {
    color: "#333",
    fontFamily: "Raleway-Bold"
  },
  labelText: {
    color: "#333",
    margin: 10,
    fontFamily: "Raleway-Bold"
  },
  formInput: {
    borderBottomWidth: 1.5,
    borderColor: "#333"
  },
  flexRow: {
    flex: 1,
    flexGrow: 1,
    flexBasis: "auto"
  }
});

const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const Label = props => (
  <Text style={[styles.labelText, props.style]}>{props.children}</Text>
);

class Field extends Component {
  constructor(props) {
    super(props);
    this.default = this.props.default || "";
    this.uploads = [];

    this.state = {
      value: this.props.default || ""
    };
  }

  componentDidMount() {
    //this._setValue(this.state.value);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.forceValue && this.props.forceValue !== prevState.value) {
      this._setValue(this.props.forceValue);
    }
  }

  render() {
    switch (this.props.type) {
      case "switch":
        return <Switch {...this.props} onChangeValue={this._setValue} />;
        break;
      case "select":
        if (
          this.props.addNoneItem &&
          this.props.data &&
          (!this.props.data.length || this.props.data[0].id != 0)
        )
          this.props.data.unshift({
            id: 0,
            name: this.props.feminin
              ? i18n.t("none_feminin")
              : i18n.t("none_masculin")
          });

        return this._renderSelect();
        break;
      case "datetime":
        return (
          <View style={styles.flexRow}>
            <Label style={this.props.labelStyle}>{this.props.label}</Label>
            <DateTimePickerField {...this.props} onChange={this._setValue} />
          </View>
        );
        break;
      case "button":
      case "submit":
      case "cancel":
        return <Button {...this.props} />;

        break;
      case "color":
        return (
          <View style={styles.flexRow}>
            {this.props.label ? <Label>{this.props.label}</Label> : null}
            <ColorPicker
              {...this.props}
              onValueChange={this._setValue}
              selectedValue={this._defaultStringValue(
                this.state.value,
                this.default
              )}
            />
          </View>
        );
        break;
      default:
        if (this.props.canAddImage)
          return <View>{this._renderEditableInput()}</View>;

        return <View>{this._renderTextInput()}</View>;
    }
  }

  _setValue = value => {
    debug.trace("Field._setValue", value);
    if (typeof this.props.onValueChange === "function")
      this.props.onValueChange(value);

    // Object.keys(this.props.parent.refs).map((d, key) => {
    //   console.log(d);
    //   if (
    //     this.props.parent.refs[d].props &&
    //     this.props.parent.refs[d].props.reenableOnFieldFormChange
    //   )
    //     this.props.parent.refs[d].props.reenable();
    // });

    if (this.props.name)
      this.props.actions.setFormValue(
        {
          form: {
            name: this.props.parent.props.name
          },
          name: this.props.name
        },
        value
      );

    if (this.props.autoSubmit && this.props.parent)
      this.props.autoSubmit(this.props.parent.props.name);

    this.setState({ value });
  };

  _resetDefaultValue = v => {
    this.default = "";
    return v.toString();
  };

  _resetNumberDefaultValue = v => {
    this.default = "";
    return v;
  };

  _defaultStringValue = (v, d) =>
    v ? this._resetDefaultValue(v) : d ? d.toString() : "";

  _defaultNumberValue = (v, d) =>
    v ? this._resetNumberDefaultValue(v) : d ? d : "";

  _addImageToText = file => {
    const { value } = this.state;
    const text = value + "\n!" + file.fileName + "!";
    this.uploads.push(file);
    this.props.actions.addUploadFile(file);
    this._setValue(text);
  };

  _renderEditableInput = () => (
    <FloatingLabel
      {...this.props}
      labelStyle={styles.labelInput}
      inputStyle={styles.input}
      style={styles.formInput}
      value={this._defaultStringValue(this.state.value, this.default)}
      onAddImage={this._addImageToText}
      onChangeText={this._setValue}
      onBlur={this.onBlur}
    >
      {this.props.label}
    </FloatingLabel>
  );

  _renderTextInput = () => (
    <FloatingLabel
      {...this.props}
      labelStyle={styles.labelInput}
      inputStyle={styles.input}
      style={styles.formInput}
      value={this._defaultStringValue(this.state.value, this.default)}
      onChangeText={this._setValue}
      onBlur={this.onBlur}
    >
      {this.props.label}
    </FloatingLabel>
  );

  _renderSelect = () => (
    <View style={styles.flexRow}>
      <Label style={this.props.labelStyle}>{this.props.label || " "}</Label>
      <Picker
        navigation={this.props.navigation}
        canReset={this.props.addNoneItem}
        placeholderStyle={styles.labelInput}
        selectedValue={this._defaultNumberValue(this.state.value, this.default)}
        onValueChange={this._setValue}
      >
        {this.props.data
          ? this.props.data.map(item => {
              let label =
                !item.name &&
                this.props.itemLabel &&
                typeof this.props.itemLabel === "function"
                  ? this.props.itemLabel(item)
                  : item.name;
              return (
                <Picker.Item label={label} key={item.id} value={item.id} />
              );
            })
          : null}
      </Picker>
    </View>
  );
}

Field.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

class Group extends Component {
  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        ref: `child${index}`,
        parent: this.props.parent,
        actions: this.props.actions
      });
    });
    return (
      <View
        {...this.props}
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center"
          //justifyContent: "space-between"
        }}
        type="group"
      >
        {children}
      </View>
    );
  }
}

Field.Group = Group;

export default Field;
