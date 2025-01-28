import * as logger from "./logger"; // imports log, info, warn and error


const CONSOLE_METHODS = ["log", "info", "error"];

const originalConsole = Object.fromEntries(
  CONSOLE_METHODS.map((method) => [method, console[method].bind(console)])
);

export const patchConsole = () => {
  for (const method of CONSOLE_METHODS) {
    console[method] = (...args) => {
        originalConsole[method](...args);
      logger[method](...args);
    };
  }
};

export const restoreConsole = () => {
  for (const method of CONSOLE_METHODS) {
    if (console[method] === logger[method]) {
      console[method] = originalConsole[method];
    }
  }
};
