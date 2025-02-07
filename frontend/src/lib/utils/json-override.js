// Save the original methods
const originalParse = JSON.parse;
const originalStringify = JSON.stringify;

// Override JSON.parse
JSON.parse = function (text, reviver) {
  try {
    // Attempt to parse the string.
    return originalParse.call(this, text, reviver);
  } catch (e) {
    // If parsing fails, return the original text.
    return text;
  }
};

// Override JSON.stringify
JSON.stringify = function (value, replacer, space) {
  try {
    // Attempt to stringify the value.
    return originalStringify.call(this, value, replacer, space);
  } catch (e) {
    // If stringification fails, return the original value.
    return value;
  }
};
