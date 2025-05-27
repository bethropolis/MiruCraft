# MiruCraft 🎨✨

**The IDE for crafting Miru extensions!**

MiruCraft is a development environment designed to streamline the creation and testing of extensions for the Miru application.

## Features

*   **🚀 Live Extension Testing:** Load and run your Miru extensions directly within MiruCraft, simulating how they would behave in the Miru app.
*   **📝 Code Editor with Miru Flavor:**
    *   Syntax highlighting for JavaScript.
    *   Autocompletion for Miru extension metadata (`@name`, `@version`, etc.).
    *   Snippets for common Miru extension structures and methods.
*   **🔍 Real-time Linting:** Integrated JSHint to catch common JavaScript errors as you type.
*   **🌐 Built-in HTTP Client:** Test network requests your extension makes, with the ability to inspect request/response headers and bodies.
*   **📜 Console Output:** View `console.log` messages from your extension directly within the IDE for easier debugging.
*   **💾 Local & Session Storage Management:** Inspect and manage data your extension might be storing.
*   **📦 Extension Management:**
    *   Import existing `.js` extension files.
    *   Export your creations as `.js` files ready for Miru.
*   **🛠️ Powered by Modern Tech:** Built with Svelte, Go, and Wails for a responsive and efficient experience.
*   **📄 Miru Compatibility:** Aims for high compatibility with the official Miru extension engine, allowing you to run and develop existing Miru extensions.

## Why MiruCraft?

The Miru application thrives on its versatile extension system. MiruCraft aims to:

*   **Lower the Barrier to Entry:** Make it easier for new developers to start creating Miru extensions.
*   **Boost Productivity:** Provide a dedicated environment that speeds up the development and debugging cycle.
*   **Promote Best Practices:** Encourage well-structured and error-free extension code through integrated tooling.
*   **Foster Community:** By simplifying extension development, we hope to see even more amazing content sources become available for Miru users.

## Getting Started

**Prerequisites:**

*  go
*  wails setup

**Installation / Running:**

*   **Desktop Version:**
    1.  **Clone the repository:**
        ```bash
        git clone https://github.com/bethropolis/MiruCraft
        cd mirucraft
        ```
    2.  **Build the application:**
        ```bash
        wails build
        ```
    3.  Run the executable found in the `build/bin` directory.

**Quick Start:**

1.  Launch MiruCraft.
2.  (Optional: Load an existing `.js` Miru extension file via the "Import" or "Open" feature).
3.  Start coding in the editor! Use the provided templates and autocompletion.
4.  Use the "Run" or "Test" feature to see your extension in action within the simulated environment.
5.  Check the Console and Network tabs for debugging information.
6.  Once satisfied, "Export" your extension.


## Development Setup (For Contributing to MiruCraft)

Interested in contributing to MiruCraft itself? Here's how to get started:

1.  **Prerequisites:**
    *   Go (version X.Y.Z)
    *   Node.js (version X.Y.Z)
    *   Wails CLI (version X.Y.Z)
2.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mirucraft.git
    cd mirucraft
    ```
3.  **Install frontend dependencies:**
    ```bash
    npm install
    # or yarn install or pnpm install
    ```
4.  **Run in development mode:**
    ```bash
    wails dev
    ```
    This will open the application in a development server with hot reloading.

## Contributing

Welcoming contributions! Whether it's bug fixes, feature enhancements, or documentation improvements.


## Roadmap (Optional - but good for showing direction)

*   [ ] Enhanced debugging tools (breakpoints, step-through).
*   [ ] Visual HTML/CSS selector helper.
*   [ ] Support for more linting/formatting tools.
*   [ ] migrating engine to golang backend

## License

This project is licensed under the [MIT License].

## Acknowledgements

*   The Miru Team for creating an excellent application and extension system.
*   The Wails, Svelte, and Go communities.
