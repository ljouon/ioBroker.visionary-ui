![Logo](admin/visionary-ui.png)

# ioBroker.visionary-ui

[![NPM version](https://img.shields.io/npm/v/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
[![Downloads](https://img.shields.io/npm/dm/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
![Number of Installations](https://iobroker.live/badges/visionary-ui-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/visionary-ui-stable.svg)
[![Dependency Status](https://img.shields.io/david/ljouon/iobroker.visionary-ui.svg)](https://david-dm.org/ljouon/iobroker.visionary-ui)

[![NPM](https://nodei.co/npm/iobroker.visionary-ui.png?downloads=true)](https://nodei.co/npm/iobroker.visionary-ui/)

**Tests:** ![Test and Release](https://github.com/ljouon/ioBroker.visionary-ui/workflows/Test%20and%20Release/badge.svg)

## visionary-ui adapter for ioBroker

![screenshot](images/screenshot.png)

🌟 Getting Started
---------------

### 📚 Prerequisites

* **ioBroker Installation**: Visionary-UI is an adapter for the ioBroker smart home system. Ensure you have ioBroker up
  and running to be able to use this ui adapter.

### ⚙️ Configuration

* **Enum Definitions**: Use the enum definition feature of ioBroker to define enums for "rooms" and "functions". These
  two aspects are crucial for
  automatic detection of states in Visionary-UI.
* **State Mapping**: Visionary-UI operates on the state level of the ioBroker hierarchy. Map the corresponding states of
  a device to at least one "room" and one "function". For instance, map a light bulb in the living room to the
  enum "living room" and the function "light".
* **Enum Levels**: Currently, only two levels (parent, child) are supported for the organisation of device states in
  these enums. Deeper nesting is not yet supported.

**Rooms**

![enum rooms](images/enum_rooms.png)

**Functions**

![enum functions](images/enum_functions.png)

💡 Supported Devices and States
----------------------------

Visionary-UI supports various device types at the state level:

* **Read-Only Sensor Data**: Sensors or values that are not writable.
* **Buttons**: Boolean value items with a role equal to "button".
* **Switches**: Boolean value items with roles different from "button".
* **Level/Meters**: Editable level states are supported via a slider component. These are number datatype values with
  defined minimum and maximum,
  and their role contains the string "level".
* **Dedicated Values**: Selectable via select boxes. These are number datatype values with dedicated states or without
  minimum and maximum definitions.
* **RGB Light Control**: Utilize "level.color.red", "level.color.green", "level.color.blue", and group them for a color
  selector component with the role "light.color".

💻 WebSockets and Webinterface
---------------------------

Visionary-UI uses a direct websocket connection to ioBroker. For that it assumes, ioBroker is available on localhost.
Other connection types different from that are not supported.

The websocket port will automatically be chosen by adding +1 to the port definition of the webinterface providing the
UI.
The UI currently does not support SSL/TLS for provisioning. The most common use case is to run it behind a reverse proxy
providing this feature. It's on my list of future tasks to support the SSL/TLS handling provided by ioBroker itself.

🤝 Feedback
----------

Your feedback and contributions is valuable to me. If you encounter any issues or have suggestions for improvements,
please feel free to open an issue.

### 📜 Scripts in `package.json`

Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description |
|-------------|-------------|
| `build` | Compile the TypeScript and React sources. |
| `watch` | Compile the TypeScript and React sources and watch for changes. |
| `build:ts` | Compile the TypeScript sources. |
| `watch:ts` | Compile the TypeScript sources and watch for changes. |
| `build:react` | Compile the React sources. |
| `watch:react` | Compile the React sources and watch for changes. |
| `test:ts` | Executes the tests you defined in `*.test.ts` files. |
| `test:package` | Ensures your `package.json` and `io-package.json` are valid. |
| `test:unit` | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| `test:integration` | Tests the adapter startup with an actual instance of ioBroker. |
| `test` | Performs a minimal test run on package files and your tests. |
| `check` | Performs a type-check on your code (without compiling anything). |
| `coverage` | Generates code coverage using your test files. |
| `lint` | Runs `ESLint` to check your code for formatting errors and potential bugs. |
| `translate` | Translates texts in your adapter to all required languages,
see [`@iobroker/adapter-dev`](https://github.com/ioBroker/adapter-dev#manage-translations) for more details. |
| `release` | Creates a new release,
see [`@alcalzone/release-script`](https://github.com/AlCalzone/release-script#usage) for more details. |

## Changelog 📅

<!--

    ! Attention: update version in io-package.json manually first with the desired version number

    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**    
-->
### 1.0.6 (2024-01-04)

* (ljouon) client menu highlighting depending on navigation
* (ljouon) nyc is able to identify namespace of ioBroker in test coverage run

### 1.0.5 (2024-01-02)

* (ljouon) client: fix protocol selection for web socket client

### 1.0.4 (2024-01-02)

* (ljouon) client: prevent sending empty state changes in rgb component
* (ljouon) web sockets are now provided on same web server port

### 1.0.3 (2024-01-02)

* (ljouon) fix value datatype for selection in select box

### 1.0.2 (2023-12-30)

* (ljouon) first release with minimal feature set

### 1.0.0-alpha.4 (2023-12-30)

* (ljouon) initial alpha

## License 📄

MIT License

Copyright (c) 2024 Lars Jouon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.