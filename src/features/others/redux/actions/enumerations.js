/**
 * enumerations API
 *
 * getenumeration GET
 * deleteenumeration DELETE
 * createenumeration CREATE
 * listenumerations LIST
 * clearenumeration
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const enumerations = new api("others", "enumerations");

export let listEnumerations = (args = {}) => enumerations.list(args);

export let reducer = (s, a) => enumerations.reducer(s, a);
