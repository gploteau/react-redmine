import initialState from "./initialState";
import { reducer as loginReducer } from "@home.actions/login";
import { reducer as usersReducer } from "@home.actions/users";
import { reducer as pressBrandReducer } from "@home.actions/pressBrand";
import { reducer as logoutReducer } from "@home.actions/logout";

const reducers = [loginReducer, usersReducer, pressBrandReducer, logoutReducer];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;

      break;
  }

  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
