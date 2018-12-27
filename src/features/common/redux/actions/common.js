import { debug } from "@common/helpers";
import { Alert } from "react-native";

export function setParameters(key, params) {
  return {
    type: "COMMON_SET_PARAMETERS",
    key: key,
    params: params
  };
}

export function testApi(args = {}) {
  return dispatch => {
    dispatch({
      type: "COMMON_TEST_API_BEGIN"
    });

    const promise = new Promise((resolve, reject) => {
      const headers = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };

      const doRequest = fetch(
        args.url + "current/users.json?key=" + args.api,
        headers
      );

      const doError = err => {
        dispatch({
          type: "COMMON_TEST_API_FAILURE",
          data: { error: err },
          contentIsLoading: false
        });

        if (err.message == "Network request failed") {
          Alert.alert(
            "Erreur réseau",
            "L'adresse " +
              args.url +
              " n'est pas joignable. Veuillez vérifier l'url renseignée dans vos paramètres."
          );
        } else {
          debug.error("_callApi.doError", err.message, err.stack);
        }
      };

      doRequest.then(
        res => {
          dispatch({
            type: "COMMON_TEST_API_SUCCESS",
            data: res
          });
          resolve(res);
        },

        err => doError(err)
      );
    }).catch(err => doError(err));

    return promise;
  };
}

countPreloader = 0;

export function reducer(state, action) {
  if (action.type == "Navigation/NAVIGATE") return state;

  switch (action.type) {
    case "COMMON_SET_PARAMETERS":
      state[action.key] = action.params;
      return { ...state };

    default:
      debug.trace("common.reducer", action, state);

      if (action.type.substr(-5) === "BEGIN") {
        debug.trace("common.reducer", "action.type = BEGIN");
        ++countPreloader;
        if (countPreloader == 1 && action.hasOwnProperty("contentIsLoading")) {
          state.isLoading = true;
          debug.trace("common.reducer", "start contentIsLoading");
        }
      } else if (action.type.substr(-7) === "SUCCESS") {
        debug.trace("common.reducer", "action.type = SUCCESS");
        --countPreloader;
        if (countPreloader == 0 && action.hasOwnProperty("contentIsLoading")) {
          state.isLoading = false;
          debug.trace("common.reducer", "stop contentIsLoading");
        }
      } else if (action.type.substr(-7) === "FAILURE") {
        debug.trace("common.reducer", "action.type = FAILURE");
        --countPreloader;
        if (countPreloader == 0 && action.hasOwnProperty("contentIsLoading")) {
          state.isLoading = false;
          debug.trace("common.reducer", "stop contentIsLoading");
        }
      }

      if (action.hasOwnProperty("contentIsLoading")) {
        state.contentIsLoading = action.contentIsLoading;
        return { ...state };
      }

      return state;
  }
}
