

/**
 * @typedef {Object} Config
 * @property {string} repo - The URL of the repository.
 * @property {string} theme - The theme of the application, e.g., "dark" or "light".
 * @property {string} language - The default language of the application.
 * @property {boolean} nsfw - Flag indicating if NSFW content is allowed.
 * @property {Object} default_headers - Default headers for HTTP requests.
 * @property {boolean} isLinterEnabled - Flag indicating if the linter is enabled.
 * @property {boolean} [recursiveConsoleOutput] - Flag indicating if recursive console output is allowed.
 */

/**
 * Default configuration object for the application.
 * @type {Config}
 */
export const defaulConfig = {
    repo: "https://miru-repo.0n0.dev",
    theme: "dark",
    language: "en",
    nsfw: false,
    default_headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive"
    },
    isLinterEnabled: true,
} 