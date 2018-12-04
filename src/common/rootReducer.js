import { combineReducers } from "redux";
import { NavigationActions } from "react-navigation";
import commonReducer from "@common.redux/reducer";
//import generated features reducer files - dont delete this line
import othersReducer from "@others.redux/reducer";
import wikiReducer from "@wiki.redux/reducer";
import projectsReducer from "@projects.redux/reducer";
import issuesReducer from "@issues.redux/reducer";
import homeReducer from "@home.redux/reducer";
import { RootNavigator } from "./routeConfig";
import { createNavigationReducer } from "react-navigation-redux-helpers";

const reducerMap = {
  common: commonReducer,
  home: homeReducer,
  projects: projectsReducer,
  issues: issuesReducer,
  others: othersReducer,
  nav: createNavigationReducer(RootNavigator)
};

export default combineReducers(reducerMap);
