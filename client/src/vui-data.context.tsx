import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { VuiEnvelope, VuiFunction, VuiRoom, VuiStateObject, VuiStateValue } from '../../src/domain';
import useWebSocket, { ConnectionState } from './useWebsocket';

export type VuiDataContextType = {
    rooms: VuiRoom[];
    functions: VuiFunction[];
    stateObjects: VuiStateObject[];
    stateValues: VuiStateValue[];
    connectionState: ConnectionState;
    sendMessage: (message: string) => void;
};

const noop = () => {};

const VuiDataContext = createContext<VuiDataContextType>({
    rooms: [],
    functions: [],
    stateObjects: [],
    stateValues: [],
    connectionState: 'UNKNOWN',
    sendMessage: noop, // Will be replaced be the correct implementation below
});

export type VuiDataProviderProps = {
    children: ReactNode;
};

export function VuiDataProvider({ children }: VuiDataProviderProps) {
    const [rooms, setRooms] = useState<VuiRoom[]>([]);
    const [functions, setFunctions] = useState<VuiFunction[]>([]);
    const [stateObjects, setStateObjects] = useState<VuiStateObject[]>([]);
    const [stateValues, setStateValues] = useState<VuiStateValue[]>([]);

    function replaceElementInArray<
        T extends {
            id: string;
        },
    >(elements: T[], data: T) {
        const result: T[] = [];
        elements.forEach((element) => {
            if (element.id === data.id) {
                result.push(data);
            }
            result.push(element);
        });
        return result;
    }

    const handleNewMessage = useCallback(
        (messageEvent: MessageEvent) => {
            const data = messageEvent.data;
            // setMessages((prev) => [...prev, data]);
            const envelope: VuiEnvelope = JSON.parse(data);
            switch (envelope.type) {
                case 'allRooms':
                    setRooms(envelope.data);
                    break;
                case 'allFunctions':
                    setFunctions(envelope.data);
                    break;
                case 'allStates':
                    setStateObjects(envelope.data);
                    break;
                case 'allValues':
                    setStateValues(envelope.data);
                    break;
                case 'room':
                    {
                        setRooms(replaceElementInArray(rooms, envelope.data));
                    }
                    break;
                case 'function':
                    {
                        setFunctions(replaceElementInArray(functions, envelope.data));
                    }
                    break;
                case 'state':
                    {
                        setStateObjects(replaceElementInArray(stateObjects, envelope.data));
                    }
                    break;
                case 'value':
                    {
                        setStateValues(replaceElementInArray(stateValues, envelope.data));
                    }
                    break;
                default:
                    console.error(`unknown element type: ${JSON.stringify(envelope)}`);
            }
        },
        [functions, stateObjects, stateValues],
    );

    const { sendMessage, connectionState } = useWebSocket(handleNewMessage);

    const contextValue = {
        rooms,
        functions,
        stateObjects,
        stateValues,
        connectionState,
        sendMessage,
    };

    return <VuiDataContext.Provider value={contextValue}>{children}</VuiDataContext.Provider>;
}

export function useVuiDataContext() {
    return useContext(VuiDataContext);
}
