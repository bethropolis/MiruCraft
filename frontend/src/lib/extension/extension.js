import { ExtensionSettingsDB } from "../db/db.js";
import { request } from "./req.js";
import * as cheerio from "cheerio";

/**
 * @typedef {import("../db/db").ExtensionSettings} ExtensionSettings
 * @typedef {import("../db/db").Extension} ExtensionType
 * @typedef {import("../types/extension").BangumiWatch} BangumiWatch
 * @typedef {import("../types/extension").Detail} Detail
 * @typedef {import("../types/extension").FikushonWatch} FikushonWatch
 * @typedef {import("../types/extension").ListItem} ListItem
 * @typedef {import("../types/extension").MangaWatch} MangaWatch
 */

/**
 * @class
 */

class Extension {
  constructor() {
    this.package = "";
    this.proxyUrl = "";
    this.webSite = "";
    this.name = "";
    this.version = "";
    this.lang = "";
    this.script = "";
    this.scriptUrl = "";
    this.author = "";
    this.license = "";
    this.description = "";
    this.type = "bangumi";
    this.nsfw = false;
  }

  /**
   * @param {string} url
   * @param {any} options
   * @returns {Promise<any>}
   */
  async request(url, options) {
    try {
      options = options || {};
      options.headers = options.headers || {};
      options.headers["Miru-Url"] = options.headers["Miru-Url"] || this.webSite;
      options.extension = this.package;

      let requestUrl = this.constructUrl(options.headers["Miru-Url"], url);

      const response = await request(requestUrl, options );

      return response;
    } catch (error) {
      console.error("Error making request:", error);
      throw new Error("Request failed");
    }
  }

  // Helper function to construct the full URL
/**
 * Constructs a full URL by combining a base URL and a relative or absolute URL.
 *
 * @param {string} baseUrl - The base URL to be used as the starting point.
 * @param {string} url - The relative or absolute URL to be appended to the base URL.
 * @returns {string} - The constructed full URL.
 */
  constructUrl(baseUrl, url) {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    if(url === "") {
      return baseUrl;
    }

    const sanitizedBase = baseUrl.replace(/\/+$/, "");
    const sanitizedUrl = url.replace(/^\/+/, "");


    return `${sanitizedBase}/${sanitizedUrl}`;
  }

  /**
   * Retrieves a setting value from the ExtensionSettingsDB based on the provided key.
   *
   * @param {string} key - The key of the setting to retrieve.
   * @return {Promise<any>} The value of the setting, or null if it doesn't exist.
   */
  async getSetting(key) {
    const settings = await ExtensionSettingsDB.getByKey(this.package, key);

    if (settings) {
      return settings.value ?? settings.defaultValue;
    }

    return null;
  }

  /**
   * Registers a setting in the ExtensionSettingsDB.
   *
   * @param {ExtensionSettings} setting - The setting to register.
   * @return {Promise<void>} A promise that resolves when the setting is successfully registered.
   */
  async registerSetting(setting) {
    await ExtensionSettingsDB.add({
      ...setting,
      package: this.package,
      defaultValue: setting.defaultValue,
    });
  }

  /**
   * Retrieves an array of elements that match a given CSS selector in the provided HTML.
   *
   * @param {string} html - The HTML content to search within.
   * @param {string} selector - The CSS selector to match against.
   * @return {Promise<Array<object>>} An array of elements that match the provided CSS selector.
   */
  async querySelectorAll(html, selector) {
    try {
      const $ = cheerio.load(html);
      const elements = $(selector).toArray();

      return elements.map((element) => ({
        element: $(element),
        content: $.html(element),
      }));
    } catch (error) {
      console.error("Error in querySelectorAll:", error);
      return [];
    }
  }

  /**
   * Retrieves the value of the specified attribute from an HTML element
   * matching the given selector.
   *
   * @param {string} html - The HTML content to search in.
   * @param {string} selector - The CSS selector used to identify the element.
   * @param {string} attribute - The name of the attribute to retrieve.
   * @return {Promise<string>} The value of the specified attribute, or undefined if
   *                  the attribute does not exist.
   */
  async getAttributeText(html, selector, attribute) {
    const $ = cheerio.load(html);
    const element = $(selector);
    return element.attr(attribute) || "";
  }

  /**
   * Queries for an element in the provided HTML using the given selector.
   *
   * @param {string} html - The HTML content to search within.
   * @param {string} selector - The CSS selector to use for querying the element.
   * @return {Object} - The element matching the provided selector.
   */
  querySelector(html, selector) {
    const $ = cheerio.load(html);
    const element = $(selector);

    return {
      element: element,
      content: element.html(),
      text: element.text(),
      innerHTML: element.html(),
      outerHTML: element.toString(),
      getAttributeText(selector = "") {
        return element.attr(selector) || "";
      },
    };
  }

  /**
   * Queries for an element in the provided HTML using the given XPath.
   * @param {string} html - The HTML content to search within.
   * @param {string} xpath - The XPath to use for querying the element.
   * @return {Object} - The element matching the provided XPath.
   * */
  queryXPath(html, xpath) {
    const $ = cheerio.load(html);
    const element = $(xpath);

    return {
      element: element,
      content: element.html(),
      text: element.text(),
      attr: element.attr(),
      innerHTML: element.html(),
      outerHTML: element.toString(),
      getAttributeText(selector = "") {
        return element.attr(selector) || "";
      },
    };
  }

  /**
   * Retrieve the latest data from the specified page.
   *
   * @param {number} page - The page number to retrieve data from.
   * @return {Promise<ListItem[]>} A promise that resolves with the latest data from the specified page.
   */
  async latest(page) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} kw
   * @param {number} page
   * @returns {Promise<ListItem[]>}
   * @abstract
   */
  async search(kw, page) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} url
   * @returns {Promise<Detail>}
   * @abstract
   */
  async detail(url) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} url
   * @returns {Promise<BangumiWatch>}
   * @abstract
   */
  async watch(url) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   * @abstract
   */
  async checkUpdate(url) {}

  /**
   * @returns {Promise<void>}
   */
  async unload() {}

  /**
   * @returns {Promise<void>}
   */
  async load() {}
}

export default Extension;
