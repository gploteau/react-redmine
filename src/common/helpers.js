import { BackHandler, Alert } from "react-native";
import appConfig from "@src/app.json";

const pluralize = (t, sing, plur, lower = true) => {
  if (typeof t === "undefined") return " ";
  if (lower) return t + " " + (t > 1 ? plur.toLowerCase() : sing.toLowerCase());
  return t + " " + (t > 1 ? plur : sing);
};

const getObjProp = (t, res, rej) => {
  return typeof t !== "undefined" ? t[res] : rej;
};

const identify = t => {
  return t.replace(new RegExp(" ", "g"), "_").toLowerCase();
};

const delay = (t, v) => {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
};

const handleAndroidBackButton = callback => {
  BackHandler.addEventListener("hardwareBackPress", () => {
    callback();
    return true;
  });
};

const exitAlert = () => {
  Alert.alert(
    "Quitter l'application",
    "Êtes-vous sûr de vouloir quitter l'application ?",
    [
      ({ text: "ANNULER", style: "cancel" },
      { text: "OUI", onPress: () => BackHandler.exitApp() })
    ]
  );
};

const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener("hardwareBackPress", () => {});
};

const parseArgs = (...args) => {
  return args[0].map((arg, i) => {
    if (typeof arg === "object") return JSON.parse(JSON.stringify(arg));
    if (i == 1) return "[@" + arg + "]";
    return arg;
  });
};
const debug = {
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
// }(x, level = 0) => {
//   if (level >= appConfig.debugLevel)
//     switch (level) {
//       case 0:
//         console.log("TRACE", x);
//         break;
//       case 1:
//         console.log("INFO", x);
//         break;
//       case 2:
//         console.warn("WARN", x);
//         break;
//       case 3:
//         console.error("ERROR", x);
//         console.trace();
//         break;
//         defaut: console.log(x);
//     }
// };

export {
  getObjProp,
  pluralize,
  debug,
  identify,
  delay,
  handleAndroidBackButton,
  exitAlert,
  removeAndroidBackButtonHandler
};
