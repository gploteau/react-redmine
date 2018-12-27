// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import i18n from "@common/i18n";
import { handleAndroidBackButton, exitAlert, debug } from "@common/helpers";
import {
  Platform,
  Text,
  Image,
  View,
  Button,
  StatusBar,
  TouchableNativeFeedback,
  FlatList,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StackActions, NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";
import {
  HeaderTitle,
  ViewFadeIn,
  Preloader,
  Tutorial
} from "@common.components";
import * as homeActions from "@home.redux/actions";
import * as issueActions from "@issues.redux/actions";
import Icon from "react-native-vector-icons/Ionicons";
import Moment from "moment";
import styles from "./styles/main";

import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";
import ActionButton from "react-native-action-button";

const CustomHeaderButton = props => (
  <Icon.Button {...props} size={30} backgroundColor={null} />
);

const TouchableMainButton = props => (
  <TouchableNativeFeedback
    useForeground
    onPress={() =>
      setTimeout(() => {
        props.nav.navigate("Issues", {
          req: props.params,
          hideFilters: false,
          scrollIndex: 0
        });
      }, 0)
    }
    background={TouchableNativeFeedback.Ripple("#b77c7c")}
  >
    <View style={{ marginTop: 10 }} pointerEvents="box-only">
      <ViewFadeIn style={styles.flatlistContainer}>
        <Text style={styles.instructions}>{props.label}</Text>
        <View style={styles.rightZoneButton}>
          <Text style={styles.rightZoneButtonText}>
            {props.count ? props.count : "0"}
          </Text>
        </View>
      </ViewFadeIn>
    </View>
  </TouchableNativeFeedback>
);

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 82;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
    /* No more header config here! */
  };
  state = {
    swiperCurrentIndex: 0
  };
  componentDidMount() {
    //global.notif.scheduleNotif();
    const { actions, navigation, common } = this.props;
    const { params } = navigation.state;

    this.state.swiperCurrentIndex = params.backSwiperIndex || 0;
  }

  _getCurrentOffset = e => {
    console.log(e.nativeEvent);
    if (
      e.nativeEvent.contentSize.height -
        e.nativeEvent.layoutMeasurement.height ==
      e.nativeEvent.contentOffset.y
    ) {
      debug.trace(e.nativeEvent);
    }
  };
  render() {
    const { actions, issues, home, navigation, common, others } = this.props;
    const { params } = navigation.state;
    debug.trace("MainScreen.render", this.props);

    Moment().locale("fr");

    return (
      <View style={styles.container}>
        {common.isLoading ? (
          <Preloader active={true} />
        ) : (
          <Swiper
            loop={false}
            index={params.backSwiperIndex || 0}
            style={styles.wrapper}
            activeDotColor={appConfig.backgroundColor}
            onIndexChanged={index =>
              this.setState({ swiperCurrentIndex: index })
            }
          >
            <View style={[styles.slide, { padding: 22 }]}>
              <Text style={styles.welcome}>
                {home.currentUser.user
                  ? (Moment().format("HH") > 18 || Moment().format("HH") < 4
                      ? i18n.t("bonsoir")
                      : i18n.t("bonjour")) +
                    " " +
                    home.currentUser.user.firstname
                  : ""}
              </Text>
              <View style={styles.screenContainer}>
                <TouchableMainButton
                  nav={navigation}
                  params={{
                    state: "issues",
                    filter: { assigned_to_id: "me" }
                  }}
                  label={i18n.t("home.my_assigned_issues")}
                  count={issues.issuesAssignedToMe.total_count}
                />
                <TouchableMainButton
                  nav={navigation}
                  params={{
                    state: "issues",
                    filter: { author_id: "me" }
                  }}
                  label={i18n.t("home.my_issues")}
                  count={issues.issuesAuthorMe.total_count}
                />
                <TouchableMainButton
                  nav={navigation}
                  params={{
                    state: "issues",
                    filter: { watcher_id: "me" }
                  }}
                  label={i18n.t("home.my_watched_issues")}
                  count={issues.issuesWatcherMe.total_count}
                />
                <View style={{ flex: 1 }}>
                  <TouchableNativeFeedback useForeground onPress={() => {}}>
                    <View>
                      <Text style={styles.instructions}>Autres demandes</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </View>
            <View style={[styles.slide, { paddingBottom: 60 }]}>
              <ScrollView
                style={{ padding: 22 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                onScroll={({ nativeEvent }) => {
                  if (isCloseToBottom(nativeEvent)) {
                    console.log(nativeEvent);
                  }
                }}
                scrollEventThrottle={400}
              >
                <Text style={styles.welcome}>Demandes</Text>
                <TouchableNativeFeedback
                  useForeground
                  onPress={() =>
                    setTimeout(() => {
                      navigation.navigate("Issues", {
                        req: {
                          state: "issues"
                        },
                        hideFilters: false,
                        backSwiperIndex: this.state.swiperCurrentIndex,
                        scrollIndex: 0
                      });
                    }, 0)
                  }
                  background={TouchableNativeFeedback.Ripple("#b77c7c")}
                >
                  <View style={styles.linkButton}>
                    <Text style={[styles.h4, styles.link]}>
                      Voir toutes les demandes
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <Text style={[styles.h4, { marginTop: 25 }]}>
                  Mes rapports personnalisés
                </Text>
                {others.queries.total_count
                  ? others.queries.queries.map((query, i) =>
                      !query.is_public ? (
                        <TouchableNativeFeedback
                          key={i}
                          useForeground
                          onPress={() =>
                            setTimeout(() => {
                              navigation.navigate("Issues", {
                                req: {
                                  state: "issues",
                                  filter: { query_id: query.id }
                                },
                                hideFilters: true,
                                backSwiperIndex: this.state.swiperCurrentIndex,
                                scrollIndex: 0
                              });
                            }, 0)
                          }
                          background={TouchableNativeFeedback.Ripple("#b77c7c")}
                        >
                          <View style={styles.linkButton}>
                            <Text style={[styles.h4, styles.link]}>
                              {query.name}
                            </Text>
                          </View>
                        </TouchableNativeFeedback>
                      ) : null
                    )
                  : null}
                <Text style={[styles.h4, { marginTop: 25 }]}>
                  Rapports personnalisés
                </Text>
                {others.queries.total_count
                  ? others.queries.queries.map((query, i) =>
                      query.is_public ? (
                        <TouchableNativeFeedback
                          key={i}
                          useForeground
                          onPress={() =>
                            setTimeout(() => {
                              navigation.navigate("Issues", {
                                req: {
                                  state: "issues",
                                  filter: { query_id: query.id }
                                },
                                hideFilters: true,
                                backSwiperIndex: this.state.swiperCurrentIndex,
                                scrollIndex: 0
                              });
                            }, 0)
                          }
                          background={TouchableNativeFeedback.Ripple("#b77c7c")}
                        >
                          <View style={styles.linkButton}>
                            <Text style={[styles.h4, styles.link]}>
                              {query.name}
                            </Text>
                          </View>
                        </TouchableNativeFeedback>
                      ) : null
                    )
                  : null}
                <View style={{ height: 60 }} />
              </ScrollView>
            </View>
          </Swiper>
        )}
        <ActionButton
          buttonColor={appConfig.backgroundColor}
          fixNativeFeedbackRadius={true}
          offsetX={23}
          offsetY={27}
          onPress={() => navigation.navigate("NewIssue")}
        />
      </View>
    );
  }
}

//export default MainScreen;

const mapStateToProps = state => ({
  home: state.home,
  common: state.common,
  issues: state.issues,
  others: state.others,
  nav: state.nav
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...homeActions, ...issueActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);
