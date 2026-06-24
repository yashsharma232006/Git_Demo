# What's New?

## 0.5.0

### Bug Fixes

- C++ tools (`GetSymbolReferences_CppTools`, `GetSymbolInfo_CppTools`, `GetCallHierarchy_CppTools`) are now on by default.
- Improved symbol resolution accuracy for C++ tools and improved overall quality.

## 0.4.0

### Features

- **CMake Diagnostics Tool** (`GetDiagnostics_CMakeTools`): Get CMake-related diagnostics that are reported in the VS Code Problems panel.

## 0.3.0

### Bug Fixes

- Improved symbol resolution accuracy for C++ tools.

## 0.2.0

### Features

- **CMake Build Tool** (`Build_CMakeTools`): Build C++ CMake projects directly from Copilot Chat using configurations from CMake Tools.
- **CMake CTest Tool** (`RunCtest_CMakeTools`): Run CTest tests from Copilot Chat with proper test discovery from CMake Tools.
- **CMake List Build Targets Tool** (`ListBuildTargets_CMakeTools`): List available build targets for a CMake project to use with the build tool.
- **CMake List Tests Tool** (`ListTests_CMakeTools`): List available tests for a CMake project to use with the CTest tool.
- **C++ Get Symbol References Tool** (`GetSymbolReferences_CppTools`): Find all references, call sites, and usages of a C/C++ symbol with semantic precision. Includes support for large result sets.
- **C++ Get Symbol Info Tool** (`GetSymbolInfo_CppTools`): Look up the definition location of a C/C++ symbol.
- **C++ Get Call Hierarchy Tool** (`GetCallHierarchy_CppTools`): Analyze function call relationships to see what functions a given function calls or what functions call it.