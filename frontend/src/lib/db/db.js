import Dexie from "dexie";

/**
 * @typedef {import("./table/extension").Extension} Extension
 * @typedef {import("./table/extension").ExtensionSettings} ExtensionSettings
 * @typedef {import("./table/setting").Settings} Settings
 * @typedef {import("./table/network").NetworkRequest} NetworkRequest
 */

export * from "./table/extension";
export * from "./table/setting";
export * from  "./table/network";

export { DB } from "./local";
export { sessionDB } from "./session";
/**
 * @class
 * @extends Dexie
 */
export class NomadDB extends Dexie {
  constructor() {
    super("NomadDB");
    this.version(2).stores({
      extension:
        "++id, id, name, &package, version, lang, type, script, enable, description, webSite, scriptUrl, author, icon, settings",
      extensionSettings:
        "++id, title, package, key, value, type, options, defaultValue, description, &[package+key]",
      settings: "++id, &key, value",
      networkRequests:
        "++id, extension, method, duration, url, response, request, headers, status, time",
    });

    /** @type {Dexie.Table<Extension, number>} */
    this.extension = this.table("extension");

    /** @type {Dexie.Table<ExtensionSettings, number>} */
    this.extensionSettings = this.table("extensionSettings");

    /** @type {Dexie.Table<Settings, number>} */
    this.settings = this.table("settings");

    /** @type {Dexie.Table<NetworkRequest, number>} */
    this.networkRequests = this.table("networkRequests");

  }
}

/** @type {NomadDB} */
export const db = new NomadDB();
