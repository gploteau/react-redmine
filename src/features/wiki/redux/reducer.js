import initialState from "./initialState";
import { reducer as wikisReducer } from "@wiki.actions/wikis";

const reducers = [
  wikisReducer,
  //append reducers here - do not delete this line
];

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
