![Logo](admin/visionary-ui.png)

# ioBroker.visionary-ui

[![NPM version](https://img.shields.io/npm/v/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
[![Downloads](https://img.shields.io/npm/dm/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
![Number of Installations](https://iobroker.live/badges/visionary-ui-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/visionary-ui-stable.svg)
[![Dependency Status](https://img.shields.io/david/ljouon/iobroker.visionary-ui.svg)](https://david-dm.org/ljouon/iobroker.visionary-ui)

[![NPM](https://nodei.co/npm/iobroker.visionary-ui.png?downloads=true)](https://nodei.co/npm/iobroker.visionary-ui/)

**Tests:** ![Test and Release](https://github.com/ljouon/ioBroker.visionary-ui/workflows/Test%20and%20Release/badge.svg)

## Visionary-UI: a new visualisation adapter for [ioBroker](https://www.iobroker.net/)

For the official ioBroker website and documentation please have a look [here](https://www.iobroker.net/).

### ❤️ What is this?

What can be expect from this adapter?

Visionary-UI is a new visualisation adapter providing a responsive user interface to the smart home system ioBroker.
You can control your smart home, observe collected sensor values or just be happy to have it all in one place as easy as
it can be. ;-)

**Features**

- Responsive UI with Light/Dark mode
- Automatic state type UI component detection
- READ-only value => just show value in UI
- Fast aspect navigation (`rooms` to `functions`) on top of each aspect card
- Custom display names
- Custom material icons
- Sorting of objects, rooms, functions
- RGB-Light support (i.e. Philips HUE lights)
- Live-Status due to use of web sockets

### 🩻 Screenshot

![screenshot](images/screenshot.png)

🌟 Getting Started
---------------

### 📚 Prerequisites

* **ioBroker Installation**: Ensure you have ioBroker up and running to be able to use this UI adapter.
* **Visionary-UI (=> before official release)**: Please find the latest version of Visionary-UI
  on [npmjs.com](https://www.npmjs.com/package/iobroker.visionary-ui) and install it manually after activation of the
  expert mode in ioBroker (*hit the button looking like a human head at the top of the admin UI*).
* **Visionary-UI (=> after official release)**: After release you can install Visionary-UI just by selection and hitting
  the "+" button in the list of available adapters.

### ⚙️ Configuration

After installation of Visionary-UI you will be asked in the admin interface to define a standard port for the
Visionary-UI web client to be hosted on.
Default port of Visionary-UI is `8088`.

* **Enum Definitions**: Visionary-UI uses the default categories of enums in ioBroker regarding `rooms` and `functions`.

  These two aspects are crucial for automatic detection of states in Visionary-UI.
  You can find them under the menu `Enums` in the admin interface of ioBroker.

    * There you can define a structure of `rooms` matching and representing your own home situation.
      You can even use a hierarchy with a depth level of 2 to define like floors/levels of your house and set rooms as
      children to these floors/levels.

    * The second aspect to define is the enum `functions`. Here it is totally up to you to define a structure or
      grouping for your devices at home. You can even use the suggestions ioBroker provides as default. For example you
      can define a function for all your *heating* related devices, *light* related devices or for specific *security*
      aspects.

* **State Mapping**: Visionary-UI operates on the state level of the ioBroker hierarchy.
  With the base configuration for enums you can now start to map your devices to corresponding enum objects just
  defined.

  But be aware that you only will be able to see your states and values if they are mapped to **both** of the defined
  enum aspects `rooms` and `functions` (at least to *ONE* of each type).

  You can map the states in the `Objects` (`#tab-objects`) section of the ioBroker admin interface or directly in
  the `Enum` (`#tab-enums`) section.

  For instance, map a light bulb in the living room to the enum "*living room*" and the function "*light*".

* **Enum Levels**: Currently, only two levels (parent, child) are supported for the organisation of device states in
  these enums. Deeper nesting is not supported yet due to side-menu restrictions.

**Rooms**

Example of a valid `rooms` mapping:

![enum rooms](images/enum_rooms.png)

**Functions**

Example of a valid `functions` mapping:

![enum functions](images/enum_functions.png)

💡 Supported Devices and States
-------------------------------

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

## Sorting of rooms, functions, objects

It is supported to manually define a sort order on the objects of an enum or the enums itself. The
enums (`rooms`, `functions`) are shown in the sidebar of Visionary-UI to build a menu structure and in the page content
representing the structure of your home.

To define a sort order you need to place custom properties directly to the objects in ioBroker.

- Please open the `Objects` (`#tab-objects`) section of the ioBroker admin interface
- Find the object you want to define and open the custom settings on the right side of the table listing represented by
  a ⚙️icon️. There you will find a setting for Visionary-UI. Please open and enable it. There is a field for the "
  *Display rank*" of that specific object.
- All objects visible in one grouping aspect in the user interface are automatically ordered in ascending order by the
  number value of this rank field (lower number comes first).

Same is possible for enums. BUT here you need to manually edit the corresponding json representation in the admin
interface.

- Activate the expert settings to see the enum objects in the table listing.
- Open the edit section for a enum you want to define a sort rank to.
- Add a custom json part to the existing object like the following:
  ```    
  "custom": {
    "visionary-ui.0": {
      "enabled": true,
      "rank": 2
    }
  }
  ```

## Custom Icons

It is supported to manually define a custom icon to an object or an enum.
All icons from this collection are supported: [Material Design Icons](https://pictogrammers.com/library/mdi/)
To define a custom icon you need to place a custom property directly to the object in ioBroker.

- Please open the `Objects` (`#tab-objects`) section of the ioBroker admin interface
- Find the object you want to define and open the custom settings on the right side of the table listing represented by
  a ⚙️icon️.
- There you will find a setting for Visionary-UI. Please open and enable it (if it is not already).
- There is a field for the "*Custom Icon*" of that specific object.
- Please enter the name of the desired icon into that field.
  You need to provide the name of the icon in the following form "*home-automation*" (small letters with dashes between
  the words) or in this form "*mdiHomeAutomation*" (with leading 'mdi' prefix and camel case words) for the "**Home
  Automation**" icon.

Same is possible for enums. BUT here you need to manually edit the corresponding json representation in the admin
interface.

- Activate the expert settings to see the enum objects in the table listing.
- Open the edit section for a enum you want to define a custom icon for.
- Add a custom json part to the existing object like the following (Please just extend the already existing parts.):
  ```    
  "custom": {
    "visionary-ui.0": {
      "enabled": true,
      "rank": 2,
      "customIcon": "home-automation"
    }
  }
  ```

## Custom Display Name

It is supported to manually define a custom name to an object or an enum.
To define a custom name you need to place a custom property directly to the object in ioBroker.

- Please open the `Objects` (`#tab-objects`) section of the ioBroker admin interface
- Find the object you want to define and open the custom settings on the right side of the table listing represented by
  a ⚙️name️.
- There you will find a setting for Visionary-UI. Please open and enable it (if it is not already).
- There is a field for the "*Display name*" of that specific object.
- Please enter the desired custom name into that field.

Same is possible for enums. BUT here you need to manually edit the corresponding json representation in the admin
interface.

- Activate the expert settings to see the enum objects in the table listing.
- Open the edit section for a enum you want to define a custom name for.
- Add a custom json part to the existing object like the following (Please just extend the already existing parts.):
  ```    
  "custom": {
    "visionary-ui.0": {
      "enabled": true,
      "rank": 2,
      "customIcon": "home-automation",
      "displayName": "My custom name"
    }
  }
  ```

💻 WebSockets and Webinterface
------------------------------

Visionary-UI uses a direct websocket connection to ioBroker.
For the web socket connection the same port is used which is configured during initial setup of Visionary-UI. You can
change the port in the configuration page of the instance afterwards as well.

The UI currently does not support SSL/TLS for provisioning.
The most common use case is to let ioBroker run behind a reverse proxy. You can define the SSL/TLS security aspect in
your reverse proxy.
It's on my list for future tasks to support default handling provided by ioBroker itself.

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