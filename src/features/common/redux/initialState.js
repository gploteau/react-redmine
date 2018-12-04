const initialState = {
  contentIsLoading: false,
  isLoading: false,
  loaded: false,
  settings: {
    url: "",
    api: ""
  },
  uploads: [],
  form: {
    newIssueForm: {},
    issueForm: {},
    filterIssuesForm: {},
    trackerSettingsForm: {},
    prioritySettingsForm: {},
    settingsForm: {
      url: "",
      api: ""
    },
    newProjectForm: {
      is_public: true
    }
  }
};

export default initialState;
