// @flow
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import appConfig from "@src/app.json";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  PermissionsAndroid,
  Animated,
  Easing,
  Alert,
  View
} from "react-native";
import { debug } from "@common/helpers";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { RalewayText } from "@common.components";
import prettyBytes from "pretty-bytes";

const styles = StyleSheet.create({
  default: {
    fontFamily: "Raleway-Regular",
    fontSize: 14
  },
  attachedFile: {
    margin: 10,
    marginTop: 0,
    backgroundColor: "#AAA"
  },
  attachedFileText: {
    color: "#333"
  },
  attachedFileBytes: {
    position: "absolute",
    right: 10,
    fontSize: 10
  },
  centerFileInfo: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12
  },
  animatedLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#b27070"
  }
});

class LoadingButton extends Component {
  constructor(props) {
    super(props);
    this.state = { width: new Animated.Value(0), downloaded: false };
  }

  componentDidMount() {
    const toFile = RNFS.ExternalDirectoryPath + "/" + this.props.file.filename;

    RNFS.exists(toFile).then(b => {
      if (b) this.state.width.setValue(100);
    });
  }

  downloadBegin = response => {
    console.log(response);
    var jobId = response.jobId;
    console.log("DOWNLOAD HAS BEGUN! JobId: " + jobId);
  };

  downloadProgress = (filesize, response) => {
    var percentage = Math.floor((response.bytesWritten / filesize) * 100);

    Animated.timing(this.state.width, {
      toValue: percentage,
      duration: 100,
      easing: Easing.linear
    }).start();
  };

  downloadFile = redownload => {
    console.log(redownload);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permission d'écriture",
        message:
          "Redmine-React a besoin d'accéder à votre disque pour enregistrer ce téléchargement."
      }
    ).then(e => {
      if (!e === PermissionsAndroid.RESULTS.GRANTED) return;

      const toFile =
        RNFS.ExternalDirectoryPath + "/" + this.props.file.filename;

      const openFile = file => {
        FileViewer.open(file, { showOpenWithDialog: true })
          .then(debug.trace("IssueScreen", "FileViewer.open.then", file))
          .catch(error => {
            debug.trace("IssueScreen", "FileViewer.open.catch", error);
          });
      };

      RNFS.exists(toFile).then(b => {
        if (b && !redownload) openFile(toFile);
        else
          RNFS.downloadFile({
            fromUrl: this.props.fromUrl,
            toFile: toFile,
            begin: this.downloadBegin,
            progressDivider: 10,
            progress: this.downloadProgress.bind(null, this.props.file.filesize)
          })
            .promise.then(res => {
              debug.trace("IssueScreen", "RNFS.downloadFile.then", res);
              this.state.width.setValue(100);
              openFile(toFile);
            })
            .catch(err => console.log(err));
      });
    });
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.attachedFile}
        delayLongPress={1000}
        onLongPress={this.downloadFile.bind(null, true)}
        onPress={this.downloadFile.bind(null, false)}
      >
        <View>
          <Animated.View
            style={[
              styles.animatedLoading,
              {
                width: this.state.width.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"]
                })
              }
            ]}
          />
          <View style={styles.centerFileInfo}>
            <RalewayText style={styles.attachedFileText}>
              {this.props.file.filename}
            </RalewayText>
            <RalewayText style={styles.attachedFileBytes}>
              {"(" + prettyBytes(this.props.file.filesize) + ")"}
            </RalewayText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

LoadingButton.propTypes = {
  fromUrl: PropTypes.string.isRequired,
  file: PropTypes.object.isRequired
};

export default LoadingButton;
