import Extension from "../extension/extension";
import { extensionDB } from "../db/db";
import {
  readExtensionMetaData,
  verExtensionMateData,
} from "../utils/extension";
import { isClient } from "../utils/is-client";
import { encode } from "js-base64";

/**
 * @typedef {import('./settings').default} SettingsStore
 */

/**
 * @class ExtensionStore
 */
export default class ExtensionStore {
  /**
   * Constructor for the class.
   *
   * @param {SettingsStore} settingsStore - An instance of the SettingsStore class.
   */
  constructor(settingsStore) {
    /** @type {Map<string, Extension>} */
    this.extensionsMap = new Map();

    /** @type {Map<string, Error>} */
    this.extensionsErrorMap = new Map();

  }

  /**
   * @param {string} script
   * @returns {Promise<string>}
   */
  async installExtension(script) {
    return new Promise(async (resolve, reject) => {
      const extensionData = readExtensionMetaData(script);

      if (!extensionData || !verExtensionMateData({ ...extensionData })) {
        return reject("Extension metadata error");
      }

      extensionData.script = script;
      script = `data:text/javascript;base64,${encode(script)}`;

      if (isClient()) {
        import(script /* @vite-ignore */)
          .then(async (module) => {
            const extension = new module.default();

            Object.assign(extension, extensionData);

            await extensionDB.addExtension(extensionData);
            this.setExtension(extension.package, extension);
            extension.load();
            return resolve(extension.package);
          })
          .catch((error) => {
            this.extensionsErrorMap.set(extensionData.package, error);
            return reject(error);
          });
      }
    });
  }

  /**
   * @param {string} pkg
   */
  unloadExtension(pkg) {
    this.extensionsMap.get(pkg)?.unload();
    this.extensionsMap.delete(pkg);
    extensionDB.deleteExtension(pkg);
  }

  /**
   * @param {string} pkg
   * @returns {Extension|undefined}
   */
  getExtension(pkg) {
    return this.extensionsMap.get(pkg);
  }

  /**
   * @param {"bangumi"|"manga"|"fikushon"} type
   * @returns {Extension[]}
   */
  getExtensionsByType(type) {
    return Array.from(this.extensionsMap.values()).filter(
      (extension) => extension.type === type
    );
  }

  /**
   * @param {string} pkg
   * @returns {Error|undefined}
   */
  getExtensionsError(pkg) {
    return this.extensionsErrorMap.get(pkg);
  }

  /**
   * @returns {Promise<void>}
   */
  async init() {
    const extensions = await extensionDB.getAllExtensions();

    Promise.all(
      (this.extensionsMap = new Map(
        extensions.map((extensionData) => {
          const extension = new Extension();

          Object.assign(extension, extensionData);

          return [extension.package, extension];
        })
      ))
    );

  }

  /**
   * @param {string} pkg
   * @param {Extension} extension
   */
  setExtension(pkg, extension) {
    this.extensionsMap.set(pkg, extension);
  }
}
