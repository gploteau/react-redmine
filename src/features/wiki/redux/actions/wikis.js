/**
 * wikis API
 *
 * getwiki GET
 * deletewiki DELETE
 * createwiki CREATE
 * listwikis LIST
 * clearwiki
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const wikis = new api("wiki", "wikis");

export let listWikis = (args = {}) => wikis.list(args);
export let getWiki = (args = {}) => wikis.get(args);
export let deleteWiki = (args = {}) => wikis.delete(args);
export let createWiki = (args = {}) => wikis.create(args);
export let clearWiki = () => wikis.clear();

export let reducer = (s, a) => wikis.reducer(s, a);
