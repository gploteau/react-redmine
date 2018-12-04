import i18n from "@common/i18n";

const initialState = {
  //append initialState here - do not delete this line
  custom_fields: {},
  issue_statuses: {},
  issue_priorities: {},
  queries: {},
  trackers: {},
  filter_status: [
    { id: 0, name: i18n.t("filter_status.all") },
    { id: 1, name: i18n.t("filter_status.opened") },
    { id: 2, name: i18n.t("filter_status.equal") },
    { id: 3, name: i18n.t("filter_status.different") },
    { id: 4, name: i18n.t("filter_status.closed") }
  ]
};

export default initialState;
