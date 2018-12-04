const initialState = {
  //append initialState here - do not delete this line
  contentIsLoading: false,
  issues: {},
  issue: {
    issue: {
      assigned_to: { id: 0, name: "" },
      author: { id: 0, name: "" },
      creaed_on: "",
      description: "",
      done_ratio: 0,
      due_date: "",
      estimated_hours: 0,
      id: 0,
      priority: { id: 0, name: "" },
      project: { id: 0, name: "" },
      start_date: "",
      status: { id: 0, name: "" },
      subject: "",
      tracker: { id: 0, name: "" },
      updated_on: ""
    }
  },
  issuesAssignedToMe: {},
  issuesAuthorMe: {},
  issuesWatcherMe: {}
};

export default initialState;
