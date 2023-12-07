import { expect } from 'chai';
import sinon from 'sinon';
import { VisionaryUiIoBrokerRepository } from './visionary-ui-iobroker.repository';
import { VuiFunctionCache, VuiRoomCache, VuiStateObjectCache, VuiStateValueCache } from './domain';

describe('VisionaryUiIoBrokerRepository', () => {
    let repository: VisionaryUiIoBrokerRepository;
    let adapter: any;

    beforeEach(() => {
        adapter = {
            getForeignObjectAsync: sinon.stub(),
            getEnumsAsync: sinon.stub(),
            getForeignObjectsAsync: sinon.stub(),
            getForeignStatesAsync: sinon.stub(),
            setForeignStateAsync: sinon.stub(),
        };
        repository = new VisionaryUiIoBrokerRepository(adapter as unknown as ioBroker.Adapter);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('getLanguage should return system language', async () => {
        adapter.getForeignObjectAsync.withArgs('system.config').resolves({
            common: { language: 'en' },
        });

        const result = await repository.getLanguage();
        expect(result).to.equal('en');
    });

    it('getLanguage should return "en" on error', async () => {
        // Simulate an error when getForeignObjectAsync is called
        adapter.getForeignObjectAsync.withArgs('system.config').rejects(new Error('Error fetching language'));

        const result = await repository.getLanguage();
        expect(result).to.equal('en');
    });

    it('getRooms should return VuiRoomCache', async () => {
        const mockRoomsData = {
            'enum.rooms.living_room': { common: { name: 'Living Room' } },
            'enum.rooms.kitchen': { common: { name: 'Kitchen' } },
        };
        adapter.getEnumsAsync.withArgs('enum.rooms').resolves({ 'enum.rooms': mockRoomsData });

        const result = await repository.getRooms('en');
        expect(result).to.be.instanceOf(VuiRoomCache);
        expect(result.values()).to.have.lengthOf(2);
    });

    it('getFunctions should return VuiFunctionCache', async () => {
        const mockFunctionsData = {
            'enum.functions.light': { common: { name: 'Light' } },
            'enum.functions.heating': { common: { name: 'Heating' } },
        };
        adapter.getEnumsAsync.withArgs('enum.functions').resolves({ 'enum.functions': mockFunctionsData });

        const result = await repository.getFunctions('en');
        expect(result).to.be.instanceOf(VuiFunctionCache);
        expect(result.values()).to.have.lengthOf(2);
    });

    it('getIoBrokerStateObjects should return VuiStateObjectCache', async () => {
        const mockStateObjectsData = {
            'iobroker.state.object.1': { type: 'state', common: { name: 'State 1' } },
            'iobroker.state.object.2': { type: 'state', common: { name: 'State 2' } },
        };
        adapter.getForeignObjectsAsync.withArgs('*', { type: 'state' }).resolves(mockStateObjectsData);

        const result = await repository.getIoBrokerStateObjects('en');
        expect(result).to.be.instanceOf(VuiStateObjectCache);
        expect(result.values()).to.have.lengthOf(2);
    });

    it('getIoBrokerStateValues should return VuiStateValueCache', async () => {
        const mockStateValuesData = {
            'iobroker.state.1': { val: 10, ack: true },
            'iobroker.state.2': { val: 20, ack: false },
        };
        adapter.getForeignStatesAsync.withArgs('*', {}).resolves(mockStateValuesData);

        const result = await repository.getIoBrokerStateValues();
        expect(result).to.be.instanceOf(VuiStateValueCache);
        expect(result.values()).to.have.lengthOf(2);
    });

    it('setVuiStateValue should set state correctly', async () => {
        const stateId = 'state1';
        const value = 123;

        // Stub the getForeignStateAsync and setForeignStateAsync methods
        adapter.setForeignStateAsync.withArgs(stateId, sinon.match.any).resolves();

        repository.setVuiStateValue('client1', stateId, value);

        sinon.assert.calledWith(adapter.setForeignStateAsync, stateId, sinon.match.has('val', value));
    });
});
