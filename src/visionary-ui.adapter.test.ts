// import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import { tests } from '@iobroker/testing';
// import path from 'path';
// import { TestHarness } from '@iobroker/testing/build/tests/integration/lib/harness';
//
// Use Chai expect and Chai as Promised for assertions
// chai.use(chaiAsPromised);
// const expect = chai.expect;
//
// tests.integration(path.join(__dirname, '../'), {
//     allowedExitCodes: [11],
//
//     controllerVersion: 'latest', // or a specific version like "4.0.1"
//
//     defineAdditionalTests({ suite }) {
//         // Since the tests are heavily instrumented, each suite gives access to a so called "harness" to control the tests.
//         suite('Test onReady()', (getHarness) => {
//             // For convenience, get the current suite's harness before all tests
//             let harness: TestHarness;
//             before(() => {
//                 harness = getHarness();
//             });
//
//             it('Should start the adapter without errors', () => {
//                 return new Promise<void>(async (resolve) => {
//                     // Start the adapter and wait until it has started
//                     await harness.startAdapterAndWait();
//
//                     expect(harness.isAdapterRunning()).to.be.true;
//                     resolve();
//                 });
//             });
//         });
//     },
// });
