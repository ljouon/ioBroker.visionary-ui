import { expect } from 'chai';
import {
    findVisionaryCustomProperties,
    mapToFunctionIds,
    mapToIobEnum,
    mapToRoomIds,
    mapToVuiStateObject,
    mapToVuiStateValue,
    mapTranslation,
} from './visionary-ui.mapper';
import { VuiEnum, VuiStateObject, VuiStateValue } from './domain';

describe('Visionary UI Mapper', () => {
    describe('mapTranslation', () => {
        it('should return the translated value for the specified language', () => {
            const value = { en: 'Test', de: 'Testen' };
            expect(mapTranslation(value, 'de')).to.equal('Testen');
        });

        it('should return the English value if specific language translation is not available', () => {
            const value = { en: 'Test' };
            expect(mapTranslation(value, 'de')).to.equal('Test');
        });

        it('should return the input string if it is not an object', () => {
            const value = 'Test';
            expect(mapTranslation(value, 'de')).to.equal('Test');
        });
    });

    describe('mapToVuiStateObject', () => {
        it('should correctly map an ioBroker Object to an VuiStateObject', () => {
            const mockIoBrokerObject = {
                _id: 'object1',
                common: {
                    name: { en: 'Object 1', de: 'Objekt 1' },
                    desc: { en: 'Description 1', de: 'Beschreibung 1' },
                    role: 'switch',
                    type: 'boolean',
                    write: true,
                    def: false,
                    unit: '°C',
                    custom: { 'visionary-ui': { displayName: 'Display Name 1', customIcon: 'icon1', rank: 1 } },
                },
                type: 'state',
                enums: { 'enum.rooms.room1': true },
            } as unknown as ioBroker.Object;

            const expectedVuiStateObject: VuiStateObject = {
                type: 'state',
                id: 'object1',
                name: 'Object 1',
                displayName: 'Display Name 1',
                description: 'Description 1',
                role: 'switch',
                datatype: 'boolean',
                iobType: 'state',
                isWriteable: true,
                defaultValue: false,
                unit: '°C',
                customIcon: 'icon1',
                rank: 1,
                minValue: 0,
                maxValue: 3,
                states: null,
                step: 1,
            };

            const result = mapToVuiStateObject('object1', mockIoBrokerObject, 'en');
            expect(result).to.deep.equal(expectedVuiStateObject);
        });
    });

    describe('mapToIobEnum', () => {
        it('should correctly map an ioBroker Object to an VuiRoom', () => {
            const mockIoBrokerRoom = {
                _id: 'room1',
                common: {
                    name: 'Living Room',
                    color: '#FF0000',
                    icon: 'icon-living-room',
                    members: ['light1', 'light2'],
                },
                type: 'enum',
            } as unknown as ioBroker.Object;

            const expectedVuiEnum: VuiEnum = {
                id: 'room1',
                type: 'room',
                name: 'Living Room',
                color: '#FF0000',
                icon: 'icon-living-room',
                members: ['light1', 'light2'],
                children: null,
                customIcon: 'icon1',
                rank: 1,
            };

            const result = mapToIobEnum('room1', mockIoBrokerRoom, 'en');
            expect(result).to.deep.equal(expectedVuiEnum);
        });

        it('should handle missing common fields in ioBrokerRoom', () => {
            const mockIoBrokerRoom = {
                _id: 'room1',
                common: {},
                type: 'enum',
            } as unknown as ioBroker.Object;

            const expectedVuiEnum: VuiEnum = {
                id: 'room1',
                type: 'room',
                name: '',
                color: null,
                icon: null,
                members: null,
                children: null,
                customIcon: 'icon1',
                rank: 1,
            };

            const result = mapToIobEnum('room1', mockIoBrokerRoom, 'en');
            expect(result).to.deep.equal(expectedVuiEnum);
        });
    });

    describe('findVisionaryCustomProperties', () => {
        it('should find custom properties prefixed with "visionary-ui"', () => {
            const mockIoBrokerObject = {
                common: {
                    custom: {
                        'visionary-ui': {
                            enabled: true,
                            customIcon: 'icon1',
                            displayName: 'Display Name 1',
                            rank: 1,
                        },
                    },
                },
            } as unknown as ioBroker.Object;

            const expectedResult = {
                enabled: true,
                customIcon: 'icon1',
                displayName: 'Display Name 1',
                rank: 1,
            };

            const result = findVisionaryCustomProperties(mockIoBrokerObject);
            expect(result).to.deep.equal(expectedResult);
        });

        it('should return null if no visionary-ui custom properties are found', () => {
            const mockIoBrokerObject = {
                common: { custom: {} },
            } as unknown as ioBroker.Object;

            const result = findVisionaryCustomProperties(mockIoBrokerObject);
            expect(result).to.be.null;
        });
    });

    describe('mapToRoomIds', () => {
        it('should return array of room ids', () => {
            const mockIoBrokerObject = {
                enums: {
                    'enum.rooms.room1': true,
                    'enum.rooms.room2': true,
                    'enum.functions.function1': true,
                },
            } as unknown as ioBroker.Object;

            const expectedResult = ['enum.rooms.room1', 'enum.rooms.room2'];
            const result = mapToRoomIds(mockIoBrokerObject);
            expect(result).to.deep.equal(expectedResult);
        });

        it('should return an empty array if no room ids are present', () => {
            const mockIoBrokerObject = { enums: {} } as unknown as ioBroker.Object;
            const result = mapToRoomIds(mockIoBrokerObject);
            expect(result).to.deep.equal([]);
        });
    });

    describe('mapToFunctionIds', () => {
        it('should return array of function ids', () => {
            const mockIoBrokerObject = {
                enums: {
                    'enum.rooms.room1': true,
                    'enum.functions.function1': true,
                    'enum.functions.function2': true,
                },
            } as unknown as ioBroker.Object;

            const expectedResult = ['enum.functions.function1', 'enum.functions.function2'];
            const result = mapToFunctionIds(mockIoBrokerObject);
            expect(result).to.deep.equal(expectedResult);
        });

        it('should return an empty array if no function ids are present', () => {
            const mockIoBrokerObject = { enums: {} } as unknown as ioBroker.Object;
            const result = mapToFunctionIds(mockIoBrokerObject);
            expect(result).to.deep.equal([]);
        });
    });

    describe('mapToVuiStateValue', () => {
        it('should correctly map an ioBroker State to an VuiStateValue', () => {
            const mockIoBrokerState = {
                val: 123,
                lc: 1609459200000, // Unix timestamp for 2021-01-01 00:00:00
            } as unknown as ioBroker.State;

            const expectedVuiStateValue: VuiStateValue = {
                type: 'value',
                id: 'state1',
                value: 123,
                lastChange: 1609459200000,
            };

            const result = mapToVuiStateValue('state1', mockIoBrokerState);
            expect(result).to.deep.equal(expectedVuiStateValue);
        });

        it('should handle null state values', () => {
            const mockIoBrokerState = { val: null, lc: 1609459200000 } as unknown as ioBroker.State;
            const expectedVuiStateValue: VuiStateValue = {
                type: 'value',
                id: 'state1',
                value: null,
                lastChange: 1609459200000,
            };

            const result = mapToVuiStateValue('state1', mockIoBrokerState);
            expect(result).to.deep.equal(expectedVuiStateValue);
        });
    });
});
