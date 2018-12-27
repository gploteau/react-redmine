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

  debug.trace("_callApi.action_type", action_type);

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

  debug.trace("_callApi.operation", operation);

  return dispatch => {
    dispatch({
      type: `${action_type}_BEGIN`,
      contentIsLoading: true
    });

    debug.trace("_callApi.dispatch");

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
          debug.trace("_callApi.UPLOAD corps de la requete", buffer);
        } catch (e) {
          debug.err("_callApi.UPLOAD.catch corps de la requete", e);
        }
      } else if (method != "GET") {
        try {
          headers["body"] = JSON.stringify(args.filter);
          debug.trace("_callApi.GET corps de la requete", args.filter);
        } catch (e) {
          debug.err("_callApi.GET.catch corps de la requete", e);
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
        debug.trace("_callApi.dispatch", data);

        debug.trace("_callApi.doSuccess.resolve", json);
        resolve(json);
      };

      const doError = err => {
        dispatch({
          type: `${action_type}_FAILURE`,
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
        } else if (err == 413) {
          Alert.alert(
            "Request Entity Too Large",
            "Le serveur où est hébergée votre application Redmine n'accepte pas l'envoi de fichier trop volumineux."
          );
        } else if (err == 404) {
          Alert.alert(
            "Ressource introuvable",
            "La ressource que vous cherchez n'a pas été trouvée."
          );
        } else {
          //debug.warn("_callApi.doError", err);
        }

        debug.trace("_callApi.doError", err);

        reject(err);
      };

      doRequest
        .then(
          res => {
            if (res.status != 401) {
              debug.trace("_callApi", method, res);
              if (res.status == 200 || res.status == 201 || res.status == 422) {
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
                doError(res.status);
              }
            } else {
              doError("Not Authorized");
            }
          },

          err => {
            doError(err);
          }
        )
        .catch(err => doError(err));
    }); //.catch(err => {
    //   if (err == "Not Authorized") {
    //     Alert.alert(
    //       "Erreur de connexion",
    //       "Il est possible que votre clé API ne soit pas correcte."
    //     );
    //   } else {
    //     debug.trace("_callApi.promise.reject", err);
    //     reject(err);
    //     debug.trace("_callApi.promise.rejected", err);
    //   }
    // });

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
