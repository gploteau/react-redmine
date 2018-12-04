/**
 * Users API
 *
 * getUser GET
 * deleteUser DELETE
 * createUser CREATE
 * listUsers LIST
 * clearUser
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const users = new api("home", "users");

export let listUsers = (args = {}) => users.list(args);
export let getUser = (args = {}) => users.get(args);
export let deleteUser = (args = {}) => users.delete(args);
export let createUser = (args = {}) => users.create(args);
export let clearUser = () => users.clear();

export let reducer = (s, a) => users.reducer(s, a);
