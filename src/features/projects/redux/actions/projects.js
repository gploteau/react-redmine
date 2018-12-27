/**
 * projects API
 *
 * getproject GET
 * deleteproject DELETE
 * createproject CREATE
 * listprojects LIST
 * clearproject
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const projects = new api("projects", "projects");

export let listProjects = (args = {}) => projects.list(args);
export let getProject = (args = {}) => projects.get(args);
export let deleteProject = (args = {}) => projects.delete(args);
export let createProject = (args = {}) => projects.create(args);
export let updateProject = (args = {}) => projects.update(args);
export let clearProject = () => projects.clear();

export let reducer = (s, a) => projects.reducer(s, a);
