import initialState from "./initialState";
import { reducer as custom_fieldsReducer } from "@others.actions/custom_fields";
import { reducer as issue_statusesReducer } from "@others.actions/issue_statuses";
import { reducer as enumerationsReducer } from "@others.actions/enumerations";
import { reducer as queriesReducer } from "@others.actions/queries";
import { reducer as trackersReducer } from "@others.actions/trackers";

const reducers = [
  trackersReducer,
  queriesReducer,
  enumerationsReducer,
  issue_statusesReducer,
  custom_fieldsReducer
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
