import { HOME_LOGOUT } from "./constants";

export function logout() {
  return {
    type: HOME_LOGOUT
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_LOGOUT:
      return {
        ...state,
        userData: {}
      };

    default:
      return state;
  }
}
