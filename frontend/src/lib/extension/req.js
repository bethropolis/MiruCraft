import { Request } from "../../../wailsjs/go/main/App";
import { networkDB } from "../db/db";
import { config } from "../store/store";

/**
 * @typedef {import("../db/table/network").NetworkRequest} NetworkRequest
 * @typedef {import("../../../wailsjs/go/models.ts").app.HTTPResponse} HTTPResponse
 * @typedef {import("../../../wailsjs/go/models.ts").app.HTTPRequest} HTTPRequest
 */

/**
 * @typedef {Object} CustomHeaders
 * @property {string} Miru-Url - Custom URL header
 * @property {string} Content-Type - Custom content type header
 */

/**
 * @typedef {Object} CustomRequestOptions
 * @property {CustomHeaders | HeadersInit } headers - The headers to include in the request
 * @property {string} [method] - The method for the request (e.g., GET, POST)
 * @property {string} [extension] - the extension package id
 * @property {any} [body] - The body of the request
 */

/**
 * Sends a request to the specified URL with the given options and returns the response data.
 *
 * @param {string} url - The URL to send the request to.
 * @param {CustomRequestOptions} options - The options for the request.
 * @return {Promise<any>} A promise that resolves with the response data if the request is successful,
 *                   or rejects with an error if the request fails.
 */
export async function request(url, options) {
  try {
    /** @type {HTTPRequest} */
    const req = {
      url,
      method: options.method || "GET",
      headers: getHeaders(options.headers) || {},
      body:  options.body || {},
    };

    const response = await Request(req);

    if(response.error) {
      throw new Error(response.error);
    }

    await storeData(req, options, response);
    if (response.status === 200) {
      const contentType = response.headers["Content-Type"];

      if (
        contentType &&
        (contentType.includes("application/json") ||
          contentType.includes("application/json; charset=utf-8"))
      ) {
        return JSON.parse(response.body); 
      } else {
        return response.body;
      }
    } else {
      throw new Error("Error, server returned status code:" + response.status);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Stores request and response data into the network database.
 *
 * @param {Object} req - The request object.
 * @param {string} req.method - The HTTP method of the request.
 * @param {string} req.url - The URL of the request.
 * @param {Object} req.body - The body of the request.
 * @param {Object} req.headers - The headers of the request.
 * @param {CustomRequestOptions} optiions - The options object.
 * @param {HTTPResponse} response - The response object.
 */
async function storeData(req, optiions, response) {
   if(!optiions.extension) return; 

  /**
   * @type {NetworkRequest}
   */
  let data = {
    method: req.method,
    duration: response.duration,
    url: req.url,
    response: response,
    request: req,
    status: response.status,
    headers: {response: response.headers, request: req.headers},
    time: new Date().toISOString(),
    extension: optiions.extension,
  };

  await networkDB.addRequest(data);
}

function getHeaders(headers) {
  let defaultHeaders = {};
  config.subscribe((value) => {
    defaultHeaders = value.default_headers;
  });

  return {
    ...defaultHeaders,
    ...headers,
  };
}
