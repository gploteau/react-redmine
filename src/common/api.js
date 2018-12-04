import { debug } from "@common/helpers";
import { Alert } from "react-native";
import { Buffer } from "buffer";

const _callApi = (settings, feature, resource, operation, args = {}) => {
  var method,
    action_type =
      `${feature.toUpperCase()}_${resource.toUpperCase()}_${operation.toUpperCase()}` +
      (args.state
        ? "_" + args.state.replace(/([A-Z]+)/g, "_$1").toUpperCase()
        : "");

  switch (operation) {
    case "DELETE":
      method = "DELETE";
      break;
    case "CREATE":
      method = "POST";
      break;
    case "UPDATE":
      method = "PUT";
      break;
    case "UPLOAD":
      method = "POST";
      action_type = "UPLOADS";
      break;
    default:
      method = "GET";
  }

  return dispatch => {
    dispatch({
      type: `${action_type}_BEGIN`,
      contentIsLoading: true
    });

    const promise = new Promise((resolve, reject) => {
      var urlId = "";

      if (
        operation == "DELETE" ||
        operation == "GET" ||
        operation == "UPDATE"
      ) {
        urlId = "/" + args.id;
      } else if (operation == "LIST" && args.isEnum) {
        urlId = "/" + args.enum;
      }

      const url =
        settings.url +
        resource.toLowerCase() +
        urlId +
        ".json?key=" +
        settings.api +
        (typeof args.filter === "object" && method == "GET"
          ? Object.keys(args.filter)
              .map(key => {
                return "&" + key + "=" + args.filter[key];
              })
              .join("")
          : "");

      console.log(url);

      const headers = {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type":
            operation == "UPLOAD"
              ? "application/octet-stream"
              : "application/json"
        }
      };

      if (operation == "UPLOAD") {
        debug.trace("_callApi", "Preparing bugger from base64 data");
        try {
          const buffer = Buffer.from(args.file.data, "base64");
          headers["body"] = buffer;
        } catch (e) {
          debug.err(e);
        }
      } else if (method != "GET") {
        try {
          headers["body"] = JSON.stringify(args.filter);
        } catch (e) {
          debug.err(e);
        }
      }

      const doRequest = fetch(url, headers);

      const doSuccess = json => {
        const data = {
          type: `${action_type}_SUCCESS`,
          state: args.state,
          contentIsLoading: false
        };
        if (operation == "UPLOAD") {
          data.state = "return";
          data.form = args.form;
          data.file = { filename: args.file.fileName, type: args.file.type };
        }
        if (data.state) data[data.state] = json;
        dispatch(data);
        resolve(json);
      };

      const doError = err => {
        dispatch({
          type: `${action_type}_FAILURE}`,
          data: { error: err },
          contentIsLoading: false
        });

        if (err.message == "Network request failed") {
          Alert.alert(
            "Erreur réseau",
            "L'adresse " +
              settings.url +
              " n'est pas joignable. Veuillez vérifier l'url renseignée dans vos paramètres."
          );
        } else if (err == 404) {
          Alert.alert(
            "Ressource introuvable",
            "La ressource que vous cherchez n'a pas été trouvée."
          );
        } else {
          debug.error("_callApi.doError", err.message, err.stack);
        }

        reject(err);
      };

      doRequest
        .then(
          res => {
            if (res.status != 401) {
              debug.trace("_callApi", res);
              if (res.status == 404) doError(res.status);
              else
                res
                  .text()
                  .then(text => {
                    const json = text ? JSON.parse(text) : {};
                    if (json.errors) {
                      doError(json.errors);
                    } else {
                      doSuccess(json);
                    }
                  })
                  .catch(err => doError(err));
            } else {
              doError("Not Authorized");
            }
          },

          err => {
            doError(err);
          }
        )
        .catch(err => doError(err));
    }).catch(err => {
      if (err == "Not Authorized") {
        Alert.alert(
          "Erreur de connexion",
          "Il est possible que votre clé API ne soit pas correcte."
        );
      }
    });

    return promise;
  };
};

var countApiInstance = 0;
var countPreloader = 0;

export class api {
  constructor(feature, resource) {
    debug.trace("api.constructor", feature, resource, ++countApiInstance);

    this.feature = feature;
    this.resource = resource;
    this.settings = {};
  }
  get(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      this.resource.toUpperCase(),
      "GET",
      args
    );
  }
  list(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      this.resource.toUpperCase(),
      "LIST",
      args
    );
  }
  create(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      this.resource.toUpperCase(),
      "CREATE",
      args
    );
  }
  upload(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      "UPLOADS",
      "UPLOAD",
      args
    );
  }
  update(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      this.resource.toUpperCase(),
      "UPDATE",
      args
    );
  }
  delete(args = {}) {
    return _callApi(
      this.settings,
      this.feature.toUpperCase(),
      this.resource.toUpperCase(),
      "DELETE",
      args
    );
  }
  clear() {
    return {
      type: `${this.feature.toUpperCase()}_${this.resource.toUpperCase()}_CLEAR`
    };
  }
  clearAll() {
    return {
      type: `${this.feature.toUpperCase()}_${this.resource.toUpperCase()}_CLEAR_ALL`
    };
  }
  reducer(state, action) {
    const ret = { ...state };

    switch (action.type) {
      case "COMMON_SET_PARAMETERS":
        this.settings = action.params;

        break;
      case `${this.feature.toUpperCase()}_${this.resource.toUpperCase()}_CLEAR_ALL`:
        ret[this.resource.toLowerCase()] = {};

        break;
      case `${this.feature.toUpperCase()}_${this.resource.toUpperCase()}_CLEAR`:
        ret[
          this.resource.toLowerCase().substr(0, this.resource.length - 1)
        ] = {};

        break;
      default:
        // if (action.hasOwnProperty("contentIsLoading") &&
        //     ret.hasOwnProperty(this.feature)) {
        //       debug(ret);
        //   ret.contentIsLoading = action.contentIsLoading;
        // } else
        if (!state.hasOwnProperty(action.state)) {
          return state;
        }

        if (action[action.state]) {
          if (action[action.state].offset > 0) {
            const obj = Object.keys(action[action.state]).length
              ? Object.keys(action[action.state])[0]
              : false;
            if (obj) {
              ret[action.state].offset = action[action.state].offset;
              ret[action.state][obj] = ret[action.state][obj].concat(
                action[action.state][obj]
              );
            }
          } else {
            ret[action.state] = action[action.state];
          }
        }
    }
    return ret;
  }
}
