/**
 * issue_statuses API
 *
 * getissue_statuse GET
 * deleteissue_statuse DELETE
 * createissue_statuse CREATE
 * listissue_statuses LIST
 * clearissue_statuse
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const issue_statuses = new api("others", "issue_statuses");

export let listIssue_statuses = (args = {}) => issue_statuses.list(args);

export let reducer = (s, a) => issue_statuses.reducer(s, a);
