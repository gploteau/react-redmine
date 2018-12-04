import initialState from "./initialState";
import { reducer as projectsReducer } from "@projects.actions/projects";

const reducers = [
  projectsReducer
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
