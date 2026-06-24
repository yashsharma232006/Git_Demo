# C/C++ DevTools

The C/C++ DevTools extension exposes C++ language and CMake build tooling as tools that **GitHub Copilot's agent mode** can invoke. It integrates with the [C/C++](https://github.com/microsoft/vscode-cpptools/) and [CMake Tools](https://github.com/microsoft/vscode-cmake-tools/) extensions to give Copilot deep, symbol-level awareness of your codebase and your active CMake build configuration.

> **Note:** This extension requires [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot). If you don't use Copilot, it has no effect on your workflow — your C/C++ and CMake Tools extensions will continue to work normally.

## Installation

This extension is automatically installed either as a dependency of [CMake Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools), or as part of the [C/C++ Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack). It does not affect your existing C++ or CMake setup in any way unless you actively use GitHub Copilot agent mode.

## What does this add beyond C/C++ and CMake Tools?

Without this extension, Copilot reasons about your C++ codebase using generic text and file search. With it, Copilot can navigate your code at the symbol level and build/test your project using your actual active CMake configuration, not ad-hoc command-line guesses.

### C++ Code Understanding Tools

| Tool | Description |
|---|---|
| **Get Symbol Definition** | Retrieve where a C++ symbol is defined and its associated metadata |
| **Get Symbol References** | Find all references to a symbol across the workspace |
| **Get Symbol Call Hierarchy** | Surface incoming and outgoing calls for a function |

To enable these tools, turn on the **Enable Cpp Code Editing Tools** setting in your VS Code user settings.

### CMake Build & Test Configuration Tools

| Tool | Description |
|---|---|
| **Build with CMake** | Build the project using your active CMake configuration |
| **Run CTests** | Run the test suite using your active CTest configuration |
| **List Build Targets** | List available build targets for the project |
| **List CTest Tests** | List available tests for the project |

For full documentation, visit [C++ DevTools docs](https://code.visualstudio.com/docs/cpp/cpp-devtools). For a detailed walkthrough of these features, read the [announcement blog post](https://devblogs.microsoft.com/cppblog/c-symbol-context-and-cmake-build-configuration-awareness-for-github-copilot-in-vs-code/).

## Feedback

To report issues or share feedback, please file them in the appropriate repository:

- For CMake-related functionality: [Issues · microsoft/vscode-cmake-tools](https://github.com/microsoft/vscode-cmake-tools/issues)
- For C++-related functionality: [Issues · microsoft/vscode-cpptools](https://github.com/microsoft/vscode-cpptools/issues)

## Data/Telemetry

This extension collects usage data and sends it to Microsoft to help improve our products and services. Collection of telemetry is controlled via the same setting provided by Visual Studio Code: `"telemetry.enableTelemetry"`. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkId=521839) to learn more.
