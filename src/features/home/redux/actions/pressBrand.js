import { HOME_PRESSBRAND } from "./constants";

export function pressBrand() {
  return {
    type: HOME_PRESSBRAND
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_PRESSBRAND:
      alert("hello");
      return {
        ...state
      };

    default:
      return state;
  }
}
