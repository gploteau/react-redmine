import React from "react";
import {
  TouchableOpacity,
  View,
  Alert,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  DrawerActions
} from "react-navigation";
import { connect } from "react-redux";
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";
import Icon from "react-native-vector-icons/FontAwesome";
import appConfig from "@src/app.json";
import { HeaderTitle } from "@common.components";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";

import {
  MainScreen,
  LoginScreen,
  FirstScreen,
  CalendarScreen,
  DrawerScreen
} from "@home.screens";

import { IssuesScreen, IssueScreen, NewIssueScreen } from "@issues.screens";
import {
  ProjectsScreen,
  ProjectScreen,
  NewProjectScreen
} from "@projects.screens";

import {
  GeneralSettingScreen,
  PrioritySettingScreen,
  TrackerSettingScreen
} from "@settings.screens";

import { WikisScreen } from "@wiki.screens";

const styles = StyleSheet.create({
  badgedIcon: {
    position: "absolute",
    top: 0,
    left: 21,
    padding: 6,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  badgedIconText: {
    color: "#f00",
    fontSize: 13,
    fontWeight: "bold"
  }
});

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

class DisplaySettingScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#CCC"
        }}
      >
        <Text>Affichage</Text>
      </View>
    );
  }
}

class UserSettingScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#CCC"
        }}
      >
        <Text>Utilisateurs</Text>
      </View>
    );
  }
}

const SettingsNavigator = createMaterialTopTabNavigator(
  {
    General: {
      screen: GeneralSettingScreen,
      navigationOptions: { title: "Général" }
    },
    // Display: {
    //   screen: DisplaySettingScreen,
    //   navigationOptions: { title: "Affichage" }
    // },
    Priorities: {
      screen: PrioritySettingScreen,
      navigationOptions: { title: "Priorités" }
    },
    Trackers: {
      screen: TrackerSettingScreen,
      navigationOptions: { title: "Trackers" }
    }
    // Users: {
    //   screen: UserSettingScreen,
    //   navigationOptions: { title: "Utilisateurs" }
    // }
  },
  {
    tabBarOptions: {
      scrollEnabled: true,
      labelStyle: {
        fontSize: 12,
        fontWeight: "bold"
      },
      style: {
        backgroundColor: appConfig.backgroundColor,
        paddingTop: 56,
        marginTop: Platform.OS == "ios" ? 20 : 0
      },
      tabStyle: {
        width: Dimensions.get("window").width / 3
      },
      indicatorStyle: {
        backgroundColor: "#fff"
      }
    }
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MainScreen,
      navigationOptions: { title: "Accueil" }
    },
    Projects: {
      screen: ProjectsScreen,
      navigationOptions: { title: "Projets" }
    },
    Calendar: {
      screen: CalendarScreen,
      navigationOptions: { title: "Calendrier" }
    },
    Wiki: {
      screen: WikisScreen,
      navigationOptions: { title: "Wiki" }
    },
    Settings: {
      screen: SettingsNavigator,
      navigationOptions: { title: "Paramètres" }
    },
    Issues: { screen: IssuesScreen },
    Issue: { screen: IssueScreen },
    Project: { screen: ProjectScreen }
  },
  {
    contentComponent: DrawerScreen,
    drawerWidth: 250,
    drawerBackgroundColor: "#354051",
    contentOptions: {
      activeTintColor: "#FFF",
      inactiveTintColor: "#DDD",
      activeBackgroundColor: "#2a323d",
      itemsContainerStyle: {
        marginVertical: 0
      },
      iconContainerStyle: {
        opacity: 1
      },
      labelStyle: {
        fontFamily: "Raleway-Bold",
        fontSize: 20
      }
    }
  }
);

const MainNavigator = createStackNavigator({
  DrawerNavigator: {
    screen: DrawerNavigator,
    navigationOptions: ({ navigation }) => {
      console.log(navigation);
      const { state } = navigation;

      return {
        headerLeft: null,
        header: props => (
          <HeaderTitle
            title={appConfig.displayName}
            details={state.routes[state.index].routeName.toUpperCase()}
            navigation={navigation}
          />
        ),
        headerStyle: {
          backgroundColor: appConfig.backgroundColor,
          shadowOpacity: 0, // This is for ios
          elevation: 0 // This is for android
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold"
        }
      };
    }
  }
});

const RootNavigator = createStackNavigator(
  {
    Main: {
      screen: MainNavigator
    },
    NewIssue: {
      screen: NewIssueScreen
    },
    NewProject: {
      screen: NewProjectScreen
    },
    Login: { screen: LoginScreen },
    First: { screen: FirstScreen }
  },
  {
    initialRouteName: "Login",
    mode: "modal",
    headerMode: "none"
  }
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, "root");

const mapStateToProps = state => ({
  state: state.nav
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator, middleware };
