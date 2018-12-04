/**
 * custom_fields API
 *
 * getcustom_field GET
 * deletecustom_field DELETE
 * createcustom_field CREATE
 * listcustom_fields LIST
 * clearcustom_field
 *
 * @format
 * @flow
 */
"use strict";
import { api } from "@common/api";

export const custom_fields = new api("others", "custom_fields");

export let listCustom_fields = (args = {}) => custom_fields.list(args);

export let reducer = (s, a) => custom_fields.reducer(s, a);
