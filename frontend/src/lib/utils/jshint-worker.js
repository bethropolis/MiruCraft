importScripts("/public/jshint.js");

self.onmessage = function (ev) {
    const req = ev.data;
    let finalCode = req.code;

    
    // Run JSHint with the given configuration on the modified code.
    JSHINT(finalCode, req.config);
    const ret = JSHINT.data();
    ret.options = null;
    self.postMessage({ task: "lint", result: JSON.stringify(ret) });
};