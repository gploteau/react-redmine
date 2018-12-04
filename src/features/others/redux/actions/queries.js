/**
 * queries API
 *
 * getquerie GET
 * deletequerie DELETE
 * createquerie CREATE
 * listqueries LIST
 * clearquerie
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const queries = new api("others", "queries");

export let listQueries = (args = {}) => queries.list(args);

export let reducer = (s, a) => queries.reducer(s, a);
