// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  getObjProp,
  debug
} from "@common/helpers";
import {
  Platform,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Button,
  StatusBar,
  Dimensions,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";
import * as issueActions from "@issues.redux/actions";
import * as projectsActions from "@projects.redux/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  HeaderTitle,
  Preloader,
  ImageAutoSize,
  ReduxForm,
  RalewayText
} from "@common.components";
import { FloatingLabel, Field } from "@common.components.fields";
import { RefreshableList } from "@home.components";
import LinearGradient from "react-native-linear-gradient";
import HTMLView from "react-native-htmlview";
import styles from "./styles/issue";
import prettyBytes from "pretty-bytes";

const htmlStyles = StyleSheet.create({
  indent: {
    marginLeft: 10
  }
});

const replaceByComponent = (text, regex, component) => {};

const customHeaderButton = props => (
  <Icon.Button {...props} backgroundColor={null} />
);

class IssueScreen extends Component {
  state = {
    refreshing: false,
    defaultStatusId: 1,
    currentProjectCategories: []
  };

  componentWillUnMount() {
    removeAndroidBackButtonHandler();
  }

  componentDidMount() {
    const { actions, navigation } = this.props;
    const { params } = navigation.state;

    actions.clearIssue();
    if (Platform.OS === "android") {
      removeAndroidBackButtonHandler();
      handleAndroidBackButton(() =>
        navigation.navigate("Issues", {
          scrollIndex: params.indexKey
        })
      );
    }
    actions.getIssue({
      state: "issue",
      id: params.issue_id,
      filter: { include: "attachments,watchers,journals,relations,children" }
    });
  }

  _onRefresh = () => {
    const { actions, navigation } = this.props;
    const { params } = navigation.state;

    this.setState({ refreshing: true });

    actions.clearIssue();
    actions
      .getIssue({
        state: "issue",
        id: params.issue_id,
        filter: {
          include: "attachments,watchers,journals,relations,children"
        }
      })
      .then(() => {
        this.setState({ refreshing: false });
      });
  };

  render() {
    const { actions, issue, navigation, common, projects, others } = this.props;

    let descArray = [],
      foundAttachs = [],
      contents = getObjProp(issue, "description", "");
    var output = "",
      listAttachments = [],
      deviceWidth = Dimensions.get("window").width;

    if (contents) {
      var input = getObjProp(issue, "description", "");

      var data = [
        { replace: /(^|\n)\*[\s][ \t]*([^\n\r]*)/g, value: "<li>$2</li>" }, //li
        {
          replace: /(^|\n)>[\s][ \t]*([^\n\r]*)/g,
          value: "<br/><indent>$2</indent>"
        }, //indent
        { replace: /h1\.[ \t]*([^\n\r]*)/g, value: "<h1>$1</h1>" }, //h1
        { replace: /h2\.[ \t]*([^\n\r]*)/g, value: "<h2>$1</h2>" }, //h2
        { replace: /h3\.[ \t]*([^\n\r]*)/g, value: "<h3>$1</h3>" }, //h3
        {
          replace: /([@\s\_\+\-]{1})\*([\S]{1}[^*]+)\*([@\s\_\+\-]{1})/g,
          value: "$1<b>$2</b>$3"
        }, //bold
        {
          replace: /([@\s\*\+\-]{1})\_([\S]{1}[^_]+)\_([@\s\*\+\-]{1})/g,
          value: "$1<i>$2</i>$3"
        }, //italic
        {
          replace: /([@\s\_\+\-]{1})\+([\S]{1}[^+]+)\+([@\s\_\+\-]{1})/g,
          value: "$1<u>$2</u>$3"
        }, //underline
        {
          replace: /([@\s\_\+\-]{1})\-([\S]{1}[^-]+)\-([@\s\_\+\-]{1})/g,
          value: "$1<s>$2</s>$3"
        }, //strike
        {
          replace: /([@\s\_\+\-]{1})@([\S]{1}[^@]+)@([@\s\_\+\-]{1})/g,
          value: "$1<pre>$2</pre>$3"
        } //strike
      ];

      output = data.reduce(function(out, item) {
        out = out.replace(item.replace, item.value);
        return out;
      }, input);

      foundAttachs = output.match(/(![A-Za-z0-9\-_\.]+!)/g);
    }

    if (issue && issue.attachments && issue.attachments.length) {
      issue.attachments.map(attachment => {
        if (foundAttachs && foundAttachs.length) {
          foundAttachs.map((piece, i) => {
            if ("!" + attachment.filename + "!" == piece) {
              output = output.replace(
                piece,
                '<img width="' +
                  (deviceWidth - 20) +
                  '" key="' +
                  attachment.id +
                  '" src="' +
                  common.settings.url +
                  "attachments/download/" +
                  attachment.id +
                  "/" +
                  attachment.filename +
                  "?key=" +
                  common.settings.api +
                  '" />'
              );
            }
          });
        }

        console.log(attachment);

        listAttachments.push(
          <TouchableOpacity
            key={listAttachments.length}
            style={styles.attachedFile}
            onPress={() => {
              return fetch(attachment.content_url)
                .then(res => {
                  console.log(res);
                })
                .catch(err => console.log(err));
            }}
          >
            <RalewayText style={styles.attachedFileText}>
              {attachment.filename}
            </RalewayText>
            <RalewayText style={styles.attachedFileBytes}>
              {"(" + prettyBytes(attachment.filesize) + ")"}
            </RalewayText>
          </TouchableOpacity>
        );
      });
    }

    const renderNode = (node, index, siblings, parent, defaultRenderer) => {
      if (node.name == "indent") {
        return (
          <Text
            key={index}
            style={{
              marginLeft: 20
            }}
          >
            {defaultRenderer(node.children, parent)}
          </Text>
        );
      } else if (node.name == "img") {
        const a = node.attribs;
        return <ImageAutoSize key={a.key} source={a.src} />;
      }
    };

    return (
      <View style={styles.container}>
        {common.isLoading ? (
          <Preloader active={true} />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {issue ? (
              <View style={{ padding: 10 }}>
                <Text style={styles.title}>
                  #{issue.id} {issue.subject}
                </Text>
                <ReduxForm
                  name="issueForm"
                  autoSubmit={formName => {
                    actions
                      .updateIssue({
                        id: navigation.state.params.issue_id,
                        filter: { issue: common.form[formName] }
                      })
                      .then(() => this._onRefresh());
                  }}
                >
                  <Field
                    name="status_id"
                    type="select"
                    label="Statut"
                    labelStyle={{ color: "#ddd" }}
                    default={issue.status.id}
                    data={getObjProp(
                      others.issue_statuses,
                      "issue_statuses",
                      []
                    )}
                    navigation={navigation}
                  />
                  <Field
                    name="priority_id"
                    type="select"
                    label="Priorité"
                    labelStyle={{ color: "#ddd" }}
                    default={issue.priority.id}
                    data={getObjProp(
                      others.issue_priorities,
                      "issue_priorities",
                      []
                    )}
                    navigation={this.props.navigation}
                  />
                </ReduxForm>
                {output ? (
                  <HTMLView
                    value={output}
                    stylesheet={htmlStyles}
                    renderNode={renderNode}
                    textComponentProps={{ style: { color: "#fff" } }}
                  />
                ) : null}
                <View style={{ marginTop: 15 }}>{listAttachments}</View>
                <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                  <Button
                    style={{ marginTop: "auto" }}
                    color={appConfig.backgroundColor}
                    title="Supprimer"
                    onPress={() =>
                      actions
                        .deleteIssue({
                          state: "issue",
                          id: navigation.state.params.issue_id
                        })
                        .then(() => {
                          actions.listIssues(navigation.state.params.req);
                          navigation.navigate("Issues");
                        })
                    }
                  />
                </View>
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  issue: state.issues.issue ? state.issues.issue.issue : {},
  projects: state.projects,
  others: state.others,
  common: state.common
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...issueActions, ...projectsActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueScreen);
