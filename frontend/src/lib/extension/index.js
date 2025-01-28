import { readExtensionMetaData } from "../utils/extension.js";
import Extension from "./extension.js";

// Attach Extension to the global object
// For browsers
if (typeof window !== "undefined") {
  Object.defineProperty(window, "Extension", {
    value: Extension,
  });
}

export class ExtensionManager {
  constructor() {
    this.extension = null;
  }


  async loadExtension(jsCode) {
    const metadata = await readExtensionMetaData(jsCode);

    const namedJsCode = this.nameJsCode(jsCode, metadata.package);                  

    const blob = new Blob([namedJsCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);

    const module = await import(url);
    this.extension = new module.default();

    // Assign metadata to the extension
    Object.assign(this.extension, metadata);

    if (this.extension.load) {
      await this.extension.load();
    }
    URL.revokeObjectURL(url);
  }

  async latest(page) {
    if (!this.extension) throw new Error("Extension not loaded");
    return await this.extension.latest(page);
  }

  async detail(url) {
    if (!this.extension) throw new Error("Extension not loaded");
    return await this.extension.detail(url);
  }

  async search(kw, page = 1) {
    if (!this.extension) throw new Error("Extension not loaded");
    return await this.extension.search(kw, page);
  }

  async watch(url) {
    if (!this.extension) throw new Error("Extension not loaded");
    return await this.extension.watch(url);
  }
  nameJsCode(jsCode, packageName) {
    return `
  ${jsCode}
//# sourceURL=${packageName}.js
`;
  }
}
