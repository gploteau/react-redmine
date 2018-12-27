import { BackHandler, Alert } from "react-native";
import appConfig from "@src/app.json";

const pluralize = (t, sing, plur, lower = true) => {
  // return 1st param (number) with plural (3rd param) if higher than 1, otherwise singular (2nd param)
  // optional lower param
  if (typeof t === "undefined") return " ";
  if (lower) return t + " " + (t > 1 ? plur.toLowerCase() : sing.toLowerCase());
  return t + " " + (t > 1 ? plur : sing);
};

const calls = (v, fallback) => {
  // return v (1st param) if defined, otherwise return the fallback (2nd param)
  return typeof v !== "undefined" ? v : fallback;
};

const getObjProp = (obj, prop, fallback) => {
  // return property (2nd param) of an object (1st param) if defined, otherwise return the fail-over (3rd param)
  return typeof obj !== "undefined" ? obj[prop] : fallback;
};

const identify = t => {
  // return an lowercase identifier with spaces replaced by underscores
  return t.replace(new RegExp(" ", "g"), "_").toLowerCase();
};

const delay = (t, v) => {
  // delay a promise with param (2nd param) of t seconds (1st param)
  // ex. delay(1000, "world").then(v => console.log('Hello ' + v));
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
};

const removeAndroidBackButtonHandler = () => {
  //remove the android back button event
  BackHandler.removeEventListener("hardwareBackPress", () => {});
};

const handleAndroidBackButton = (callback, removeEvent = true) => {
  // handle the android back button event
  if (removeEvent) removeAndroidBackButtonHandler();
  BackHandler.addEventListener("hardwareBackPress", () => {
    callback();
    return true;
  });
};

const exitAlert = () => {
  // Confirmation dialog for exit app
  Alert.alert(
    "Quitter l'application",
    "Êtes-vous sûr de vouloir quitter l'application ?",
    [
      ({ text: "ANNULER", style: "cancel" },
      { text: "OUI", onPress: () => BackHandler.exitApp() })
    ]
  );
};

const parseArgs = (...args) => {
  // return a string of an object
  return args[0].map((arg, i) => {
    if (typeof arg === "object") return JSON.parse(JSON.stringify(arg));
    if (i == 1) return "[@" + arg + "]";
    return arg;
  });
};

const debug = {
  // display in console depending of debug level defined in @src/app.json (debugLevel)
  trace: (...args) => {
    if (appConfig.debugLevel == 0)
      console.log.apply(console, parseArgs(["TRACE", ...args]));
  },
  info: (...args) => {
    if (appConfig.debugLevel <= 1)
      console.log.apply(console, parseArgs(["INFO", ...args]));
  },
  warn: (...args) => {
    if (appConfig.debugLevel <= 2)
      console.warn.apply(console, parseArgs(["WARN", ...args]));
  },
  error: (...args) => {
    if (appConfig.debugLevel <= 3)
      console.error.apply(console, parseArgs(["ERROR", ...args]));
  }
};

export {
  calls,
  getObjProp,
  pluralize,
  debug,
  identify,
  delay,
  handleAndroidBackButton,
  exitAlert,
  removeAndroidBackButtonHandler
};
