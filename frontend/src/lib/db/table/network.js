import { db } from '../db';

/**
 * @typedef {Object} NetworkRequest
 * @property {number} [id]
 * @property {string} method HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE')
 * @property {string} duration Time taken for the request to complete (e.g., '200ms')
 * @property {string} url The URL of the requested resource
 * @property {object} response The response data received from the server (can be stored as JSON string)
 * @property {object} request The request data sent to the server (can be stored as JSON string)
 * @property {number} status HTTP status code (e.g., 200, 404, 500)
 * @property {object} headers HTTP Headers object
 * @property {string} time Timestamp of the request (e.g., ISO 8601 string)
 * @property {string} extension The name or ID of the extension that made the request
 */

/**
 * @namespace network
 */
export const networkDB = {
  /**
   * Adds a new network request to the database.
   * @param {NetworkRequest} request The network request data to be stored.
   * @returns {Promise<number>} The ID of the newly added request.
   */
  addRequest: async (request) => {
    return db.networkRequests.add(request);
  },


  /**
   * get request by id
   * @param {number} id - The id of the request
   * @returns {Promise<NetworkRequest>} The request object.
   */
  getRequestById: async (id) => {
    return db.networkRequests.get(id);
  },


  /**
   * Retrieves all network requests from the database.
   * @returns {Promise<NetworkRequest[]>} An array of all network requests.
   */
  getAllRequests: () => {
    return db.networkRequests.reverse().toArray();
  },

  /**
   * Retrieves network requests for a specific extension.
   * @param {string} extensionName The name of the extension.
   * @returns {Promise<NetworkRequest[]>} An array of network requests for the given extension.
   */
  getRequestsByExtension: (extensionName) => {
    return db.networkRequests.where({ extension: extensionName }).toArray();
  },

  /**
   * Retrieves all unique extension names from the database.
   
   * @returns {Promise<string[]>} An array of unique extension names.
   */
  getListOfExtensions: async () => {
    const uniqueExtensions = [];
    await db.networkRequests
      .orderBy('extension')
      .eachUniqueKey((extension) => {
        uniqueExtensions.push(extension);
      });
    return uniqueExtensions;
  },

/**
 * Retrieves the most recent network request from the database.
 * @returns {Promise<NetworkRequest>} The most recent network request.
 */
getLastRequest: async () => {
  const count = await db.networkRequests.count();
  if (count === 0) return null;
  return db.networkRequests.orderBy('id').reverse().first();
},

  /**
   * Clears all network requests from the database.
   * @returns {Promise<void>} Resolves when the requests are cleared.
   */
  clearRequests: () => {
    return db.networkRequests.clear();
  },
};