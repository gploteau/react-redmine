/**
 * issues API
 *
 * getissue GET
 * deleteissue DELETE
 * createissue CREATE
 * listissues LIST
 * clearissue
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const issues = new api("issues", "issues");

export let listIssues = (args = {}) => issues.list(args);
export let getIssue = (args = {}) => issues.get(args);
export let updateIssue = (args = {}) => issues.update(args);
export let deleteIssue = (args = {}) => issues.delete(args);
export let createIssue = (args = {}) => issues.create(args);
export let uploadFile = (args = {}) => issues.upload(args);
export let clearIssue = () => issues.clear();
export let clearIssues = () => issues.clearAll();

export let reducer = (s, a) => issues.reducer(s, a);
