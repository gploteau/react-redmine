// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import i18n from "@common/i18n";
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  debug,
  pluralize
} from "@common/helpers";
import {
  Platform,
  Dimensions,
  Text,
  Image,
  View,
  Button,
  StatusBar,
  Animated,
  ActivityIndicator,
  TouchableNativeFeedback
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import * as issuesActions from "@issues.redux/actions";
import * as commonActions from "@common.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { RefreshableList } from "@issues.components";
import LinearGradient from "react-native-linear-gradient";
import Svg, { G, Path } from "react-native-svg";
import styles from "./styles/issues";
import { HeaderTitle, ReduxForm } from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;
const STATUS_BAR_OFFSET = Platform.OS === "android" ? 80 : 0;

const origin = {};

class IssuesScreen extends React.Component {
  componentWillUnMount() {
    removeAndroidBackButtonHandler();
  }

  state = {
    animatedFilterView: new Animated.Value(0),
    animatedFilterViewSubmitButton: new Animated.Value(0),
    animatedFilterBarTop: new Animated.Value(0),
    filterViewSubmitButtonVisible: false,
    filterViewSubmitButtonGreen: false,
    currentContentOffsetY: 0,
    filterStatusId: 0,
    statusIdSelected: 1
  };

  updateAndroidBackButton = handle => {
    const { actions, navigation, common, issues } = this.props;
    const { params } = navigation.state;

    if (handle)
      debug.trace("IssuesScreen.updateAndroidBackButton defined custom handle");

    if (Platform.OS === "android") {
      handleAndroidBackButton(
        typeof handle === "function"
          ? handle
          : () => {
              navigation.navigate(
                params.backScreen ? params.backScreen.screen : "Home",
                params.backScreen
                  ? params.backScreen.params
                  : {
                      backSwiperIndex: params.backSwiperIndex
                    }
              );
            }
      );
    }
  };

  componentDidMount() {
    const { actions, navigation, common, issues } = this.props;
    const { params } = navigation.state;

    actions.clearIssues();

    this.updateAndroidBackButton();

    const allIssues = params.req.state ? issues[params.req.state] : null;

    if (params.req && params.req.state == "issues") {
      actions.listIssues(params.req);
    }
  }

  _setCurrentOffset = e => {
    if (this.state.currentContentOffsetY > e.nativeEvent.contentOffset.y) {
      debug.trace("currentContentOffsetY up", e.nativeEvent.contentOffset.y);
      if (this.state.filtersBarTop < 0)
        this.setState({ filtersBarTop: e.nativeEvent.contentOffset.y });
    } else if (
      this.state.currentContentOffsetY < e.nativeEvent.contentOffset.y
    ) {
      debug.trace("currentContentOffsetY down", e.nativeEvent.contentOffset.y);
      if (this.state.filtersBarTop > -60)
        this.setState({ filtersBarTop: -e.nativeEvent.contentOffset.y });
    }
    this.setState({ currentContentOffsetY: e.nativeEvent.contentOffset.y });
    if (
      e.nativeEvent.contentSize.height -
        e.nativeEvent.layoutMeasurement.height ==
      e.nativeEvent.contentOffset.y
    ) {
      debug.trace(e.nativeEvent);
      const { actions, issues, navigation, common } = this.props;
      const req = navigation.state.params.req;
      const iss = issues[navigation.state.params.req.state];
      if (
        iss.total_count >= iss.offset + iss.limit &&
        !common.contentIsLoading
      ) {
        req.filter.offset = iss.offset + iss.limit;
        actions.listIssues(req);
      }
    }
  };

  _animateFiltersView = value => {
    if (this.state.filterViewSubmitButtonVisible && value > 0) return;
    this.state.animatedFilterView.setValue(value > 0 ? 0 : 1);

    if (value) {
      this.updateAndroidBackButton(() => {
        this._animateFiltersView(-1);
      });
      this.setState({
        filterViewSubmitButtonVisible: value == -1 ? false : true
      });
      Animated.sequence([
        Animated.spring(this.state.animatedFilterView, {
          toValue: value > 0 ? 1 : 0,
          friction: value > 0 ? 6 : 8,
          tension: value > 0 ? 20 : 30
        }),
        Animated.spring(this.state.animatedFilterViewSubmitButton, {
          toValue: value > 0 ? 1 : 0,
          friction: 4,
          tension: 10
        })
      ]).start();
    } else {
      this.updateAndroidBackButton();

      this.setState({ filterViewSubmitButtonGreen: true });

      const { actions, navigation, common } = this.props;

      const req = navigation.state.params.req;
      if (req.filter) req.filter.offset = 0;

      if (common.form["filterIssuesForm"].tracker_id == 0)
        delete common.form["filterIssuesForm"].tracker_id;

      navigation.state.params.req.filter = {
        ...req.filter,
        ...common.form["filterIssuesForm"]
      };

      debug.trace(
        "IssuesScreen._animateFiltersView",
        navigation.state.params.req
      );

      actions.listIssues(navigation.state.params.req);

      Animated.sequence([
        Animated.spring(this.state.animatedFilterViewSubmitButton, {
          toValue: 0
        }),
        Animated.spring(this.state.animatedFilterView, {
          friction: 8,
          tension: 30,
          toValue: 0
        })
      ]).start(() => {
        this.setState({
          filterViewSubmitButtonVisible: false,
          filterViewSubmitButtonGreen: false
        });
      });
    }
  };

  render() {
    const { actions, issues, navigation, common, others } = this.props;
    const { params } = navigation.state;
    const interpolateFilterViewWidth = this.state.animatedFilterView.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [150, WINDOW_WIDTH]
      }
    );

    const interpolateFilterViewHeight = this.state.animatedFilterView.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [50, WINDOW_HEIGHT - STATUS_BAR_OFFSET]
      }
    );

    const interpolateFilterViewBGColor = this.state.animatedFilterView.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [appConfig.backgroundColor, "#333"]
      }
    );

    const interpolateFilterViewSubmitButton = this.state.animatedFilterViewSubmitButton.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [1.5, 1]
      }
    );

    const filterViewStyles = {
      width: interpolateFilterViewWidth,
      height: interpolateFilterViewHeight,
      backgroundColor: interpolateFilterViewBGColor
    };

    if (others.trackers.trackers && others.trackers.trackers[0].id != 0) {
      others.trackers.trackers.unshift({
        name: "Tous",
        id: 0
      });
    }

    const allIssues = params.req.state ? issues[params.req.state] : null;

    return (
      <View style={styles.container}>
        {allIssues.total_count ? (
          <RefreshableList
            onScroll={this._setCurrentOffset}
            data={
              allIssues.total_count
                ? allIssues.issues.map((issue, i) => {
                    const key = { key: i.toString() };
                    return { ...issue, ...key };
                  })
                : []
            }
            fetchData={() => {
              return actions.listIssues(params.req);
            }}
            navigation={navigation}
            options={{ colors: common.settings.colors }}
          />
        ) : null}

        <Animated.View style={styles.linearGradientView}>
          <LinearGradient
            colors={["transparent", "rgba(30, 30, 30, 0.8)"]}
            style={styles.linearGradient}
          >
            <View style={styles.bottomMenuCloseButtonContainer}>
              <Icon.Button
                style={{ height: 40, paddingLeft: 10, paddingRight: 7 }}
                name="times"
                size={23}
                backgroundColor={null}
                onPress={() =>
                  navigation.navigate(
                    params.backScreen ? params.backScreen.screen : "Home",
                    params.backScreen
                      ? params.backScreen.params
                      : {
                          backSwiperIndex: params.backSwiperIndex
                        }
                  )
                }
              />
            </View>
            {!params.hideFilters ? (
              <TouchableNativeFeedback
                onPress={() => {
                  this._animateFiltersView(1);
                }}
              >
                <Animated.View
                  style={[styles.bottomMenuFiltersContainer, filterViewStyles]}
                >
                  <View>
                    <Text style={styles.bottomMenuFiltersText}>Filtres</Text>
                    <Text style={styles.bottomMenuFiltersTextDetails}>
                      {pluralize(
                        allIssues.total_count,
                        i18n.t("issues.result"),
                        i18n.t("issues.results")
                      )}
                    </Text>
                    <View>
                      <ReduxForm name="filterIssuesForm">
                        <Field.Group>
                          <Field
                            type="select"
                            label="Statut"
                            labelStyle={{ color: "#fff" }}
                            default={0}
                            data={others.filter_status}
                            navigation={navigation}
                            onValueChange={v => {
                              this.setState({
                                filterStatusId: v
                              });

                              let value = "*";
                              if (v == 1) value = "open";
                              if (v == 4) value = "closed";

                              actions.setFormValue(
                                {
                                  form: {
                                    name: "filterIssuesForm"
                                  },
                                  name: "status_id"
                                },
                                value
                              );
                            }}
                          />
                          {this.state.filterStatusId == 2 ||
                          this.state.filterStatusId == 3 ? (
                            <Field
                              type="select"
                              default={1}
                              data={others.issue_statuses.issue_statuses}
                              navigation={navigation}
                              onValueChange={v => {
                                this.setState({
                                  statusIdSelected: v
                                });

                                let value =
                                  this.state.filterStatusId == 3 ? "!" + v : v;

                                actions.setFormValue(
                                  {
                                    form: {
                                      name: "filterIssuesForm"
                                    },
                                    name: "status_id"
                                  },
                                  value
                                );
                              }}
                            />
                          ) : (
                            []
                          )}
                        </Field.Group>
                        <Field
                          name="tracker_id"
                          type="select"
                          label="Tracker"
                          labelStyle={{ color: "#fff" }}
                          default={common.form["filterIssuesForm"].tracker_id}
                          data={others.trackers.trackers}
                          navigation={navigation}
                        />
                      </ReduxForm>
                    </View>
                  </View>
                  {this.state.filterViewSubmitButtonVisible ? (
                    <Animated.View
                      style={{
                        opacity: this.state.animatedFilterViewSubmitButton,
                        position: "absolute",
                        height: 50,
                        width: 50,
                        bottom: 15,
                        right: 15,
                        transform: [
                          { scale: interpolateFilterViewSubmitButton }
                        ]
                      }}
                    >
                      <TouchableNativeFeedback
                        onPress={() => {
                          this._animateFiltersView(0);
                        }}
                      >
                        <Svg width="50" height="50" viewBox="0 0 50 50">
                          <G transform="translate(-220.39838,-114.66395)">
                            <Path
                              fill={
                                this.state.filterViewSubmitButtonGreen
                                  ? "#009900"
                                  : "#999"
                              }
                              d="m 244.33542,164.65639 c -1.60451,-0.10706 -2.58696,-0.22555 -3.77264,-0.455 -3.12747,-0.60523 -6.37567,-1.94522 -9.03492,-3.72721 -5.20778,-3.4898 -8.92392,-8.78602 -10.40611,-14.83073 -1.1233,-4.58113 -0.93533,-9.3718 0.54285,-13.83455 2.17206,-6.55767 6.94006,-11.9104 13.2083,-14.82809 5.67529,-2.64171 12.28636,-3.04336 18.22316,-1.10714 5.837,1.90366 10.65557,5.76185 13.84009,11.08163 0.4652,0.77713 1.37631,2.64045 1.72116,3.51997 1.93574,4.937 2.26689,10.35072 0.94567,15.45973 -1.54916,5.99046 -5.27799,11.20121 -10.4555,14.61077 -4.02522,2.65074 -8.51528,4.03121 -13.36883,4.11024 -0.64059,0.0104 -1.29004,0.0106 -1.44323,5.4e-4 z m 3.08108,-6.02668 c 3.13342,-0.32257 6.24653,-1.48063 8.85006,-3.29215 2.15146,-1.49699 4.12265,-3.59843 5.46496,-5.82607 2.69858,-4.47845 3.43568,-9.86537 2.04432,-14.94038 -0.70603,-2.57527 -1.99982,-5.03818 -3.75613,-7.15035 -0.22439,-0.26985 -0.7631,-0.84433 -1.19714,-1.27662 -3.16046,-3.14775 -7.16072,-5.02311 -11.67666,-5.47412 -0.33422,-0.0333 -1.12039,-0.0607 -1.74706,-0.0607 -0.62666,0 -1.41284,0.0273 -1.74706,0.0607 -4.52275,0.45169 -8.50584,2.31922 -11.67665,5.47475 -1.57576,1.56816 -2.68253,3.09464 -3.63557,5.01421 -1.36795,2.75532 -1.99544,5.43087 -1.99544,8.50836 0,2.52733 0.4058,4.68291 1.31571,6.98902 0.97631,2.47437 2.35426,4.56809 4.26789,6.48483 4.10177,4.10845 9.68306,6.0862 15.48877,5.48852 z m -11.25219,-11.39505 c -2.91444,-3.00211 -5.29899,-5.47323 -5.29899,-5.49135 0,-0.0545 4.21652,-4.12883 4.249,-4.10572 0.0165,0.0118 1.47361,1.50939 3.23797,3.32808 l 3.20793,3.30669 6.28698,-6.18793 c 3.45783,-3.40336 6.65222,-6.54682 7.09865,-6.98546 l 0.81168,-0.79754 2.06629,2.10018 c 1.13646,1.1551 2.05871,2.12013 2.04945,2.14453 -0.009,0.0244 -0.92835,0.94093 -2.04242,2.03675 -1.11407,1.09584 -3.41542,3.36055 -5.11413,5.03271 -1.6987,1.67215 -4.52439,4.45188 -6.2793,6.17718 -1.75491,1.7253 -3.592,3.53366 -4.08243,4.01859 l -0.89169,0.88169 -5.29899,-5.4584 z"
                            />
                          </G>
                        </Svg>
                      </TouchableNativeFeedback>
                    </Animated.View>
                  ) : null}
                </Animated.View>
              </TouchableNativeFeedback>
            ) : null}
          </LinearGradient>
        </Animated.View>
        {common.contentIsLoading ? (
          <ActivityIndicator style={{ margin: 10 }} />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  issues: state.issues,
  common: state.common,
  others: state.others
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...issuesActions, ...commonActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesScreen);
