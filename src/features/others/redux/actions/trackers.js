/**
 * trackers API
 *
 * gettraker GET
 * deletetraker DELETE
 * createtraker CREATE
 * listtrakers LIST
 * cleartraker
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const trackers = new api("others", "trackers");

export let listTrackers = (args = {}) => trackers.list(args);

export let reducer = (s, a) => trackers.reducer(s, a);
