![Logo](admin/visionary-ui.png)

# ioBroker.visionary-ui

[![NPM version](https://img.shields.io/npm/v/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
[![Downloads](https://img.shields.io/npm/dm/iobroker.visionary-ui.svg)](https://www.npmjs.com/package/iobroker.visionary-ui)
![Number of Installations](https://iobroker.live/badges/visionary-ui-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/visionary-ui-stable.svg)
[![Dependency Status](https://img.shields.io/david/ls2pw/iobroker.visionary-ui.svg)](https://david-dm.org/ls2pw/iobroker.visionary-ui)

[![NPM](https://nodei.co/npm/iobroker.visionary-ui.png?downloads=true)](https://nodei.co/npm/iobroker.visionary-ui/)

**Tests:** ![Test and Release](https://github.com/ls2pw/ioBroker.visionary-ui/workflows/Test%20and%20Release/badge.svg)

## visionary-ui adapter for ioBroker

Introducing VisionaryUI, your gateway to a seamlessly responsive user interface for managing your smart home devices.
Experience the future with a sleek design that not only enhances the aesthetic appeal but also ensures optimal
functionality.

## Developer manual

This section is intended for the developer. It can be deleted later

### TODO:

- [x] create iobroker.visionary-ui adapter using create-adapter tool
- [x] refactor adapter to use react-adapter-v5
- [x] prototype serving client using express server
- [x] client build should work with adapter build
- [x] add web socket to main.ts as backend API for client
- [x] add useWebSocket: https://www.npmjs.com/package/react-use-websocket
- [x] business logics for structure and states in backend: rooms, categories, devices, states
- [x] connect client to web socket
- [x] think about splitting web server and socket server implementations
- [x] handle enum changes (might be an object change with id starting with 'enum.')
- [x] handle object to enum association changes, add/remove
- [x] adapter tests
- [x] WIP: API Definition: how to tell client the type of the message (wrap in object: envelop)
- [x] implement basic client UI
- [x] Routing
- [x] Switch between rooms und functions via click on headlines/card headers
- [x] Sorting of rooms and functions? => as custom settings?
- [x] Allow Icons for enums as custom settings?
- [x] Image handling for page title, section title, objects in the same way as in sidebar
- [x] use web port + 1 as socket port (for now)
-
- [x] multi language in client => client gets language key already
- [ ] add i18n to client
- [ ] color picker for color lights
- [ ] check ioBroker best practises and release (beta first)

- [ ] handle/flatten level depth for rooms and functions
- [ ] Popover info on icon click
- [ ] show only if the value of a specific other object is true (rules engine support), setting in object list
- [ ] invalid config message!?
- [ ] map multiple objects to a specific card and let unused objects remain for other cards
- [ ] upgrade admin to react 18?
- [ ] refactor client serving to iobroker.web adapter?

### Getting started

You are almost done, only a few steps left:

1. Create a new repository on GitHub with the name `ioBroker.visionary-ui`
1. Initialize the current folder as a new git repository:
    ```bash
    git init -b main
    git add .
    git commit -m "Initial commit"
    ```
1. Link your local repository with the one on GitHub:
    ```bash
    git remote add origin https://github.com/ls2pw/ioBroker.visionary-ui
    ```

1. Push all files to the GitHub repo:
    ```bash
    git push origin main
    ```

1. Head over to [src/main.ts](src/main.ts) and start programming!

### Best Practices

We've collected
some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding
ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### Scripts in `package.json`

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

### Configuring the compilation

The adapter template uses [esbuild](https://esbuild.github.io/) to compile TypeScript and/or React code. You can
configure many compilation settings
either in `tsconfig.json` or by changing options for the build tasks. These options are described in detail in the
[`@iobroker/adapter-dev` documentation](https://github.com/ioBroker/adapter-dev#compile-adapter-files).

### Writing tests

When done right, testing code is invaluable, because it gives you the
confidence to change your code while knowing exactly if and when
something breaks. A good read on the topic of test-driven development
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92.
Although writing tests before the code might seem strange at first, but it has very
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

### Publishing the adapter

Using GitHub Actions, you can enable automatic releases on npm whenever you push a new git tag that matches the form
`v<major>.<minor>.<patch>`. We **strongly recommend** that you do. The necessary steps are described
in `.github/workflows/test-and-release.yml`.

Since you installed the release script, you can create a new
release simply by calling:

```bash
npm run release
```

Additional command line options for the release script are explained in the
[release-script documentation](https://github.com/AlCalzone/release-script#command-line).

To get your adapter released in ioBroker, please refer to the documentation
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually with dev-server

Since you set up `dev-server`, you can use it to run, test and debug your adapter.

You may start `dev-server` by calling from your dev directory:

```bash
dev-server watch
```

The ioBroker.admin interface will then be available at http://localhost:8081/

Please refer to the [`dev-server` documentation](https://github.com/ioBroker/dev-server#command-line) for more details.

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

* (ljouon) initial release

## License

MIT License

Copyright (c) 2023 ljouon <lars.jouon@codecentric.de>

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