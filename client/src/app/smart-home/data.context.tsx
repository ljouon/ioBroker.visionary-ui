import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {
    VuiActionEnvelope,
    VuiDataEnvelope,
    VuiFunction,
    VuiRoom,
    VuiStateObject,
    VuiStateValue,
} from '../../../../src/domain';
import {AspectNode, createAspectStructure} from '@/app/smart-home/structure/aspect';
import {ConnectionState, useWebSocket} from '@/app/smart-home/socket';

export type VuiDataContextType = {
    roomAspectNodes: AspectNode[];
    functionAspectNodes: AspectNode[];
    stateObjects: VuiStateObject[];
    stateValues: VuiStateValue[];
    connectionState: ConnectionState;
    sendVuiAction: (message: VuiActionEnvelope) => void;
};

const noop = () => {
};

export const VuiDataContext = createContext<VuiDataContextType>({
    roomAspectNodes: [],
    functionAspectNodes: [],
    stateObjects: [],
    stateValues: [],
    connectionState: 'UNKNOWN',
    sendVuiAction: noop, // Will be replaced by the correct implementation below
});

export function useVuiDataContext() {
    return useContext(VuiDataContext);
}

export type VuiDataProviderProps = {
    children: ReactNode;
};

export function VuiDataProvider({children}: VuiDataProviderProps) {
    const [rooms, setRooms] = useState<VuiRoom[]>([]);
    const [functions, setFunctions] = useState<VuiFunction[]>([]);
    const [stateObjects, setStateObjects] = useState<VuiStateObject[]>([]);
    const [stateValues, setStateValues] = useState<VuiStateValue[]>([]);
    const [roomAspectNodes, setRoomAspectNodes] = useState<AspectNode[]>([]);
    const [functionAspectNodes, setFunctionAspectNodes] = useState<AspectNode[]>([]);

    function replaceElementInArray<
        T extends {
            id: string;
        },
    >(elements: T[], data: T) {
        const result: T[] = [];
        elements.forEach((element) => {
            if (element.id === data.id) {
                result.push(data);
            } else {
                result.push(element);
            }
        });
        return result;
    }

    const handleNewMessage = useCallback(
        (messageEvent: MessageEvent) => {
            const data = messageEvent.data;
            const envelope: VuiDataEnvelope = JSON.parse(data);
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
                case 'room': {
                    setRooms(replaceElementInArray(rooms, envelope.data));
                }
                    break;
                case 'function': {
                    setFunctions(replaceElementInArray(functions, envelope.data));
                }
                    break;
                case 'state': {
                    setStateObjects(replaceElementInArray(stateObjects, envelope.data));
                }
                    break;
                case 'value': {
                    setStateValues(replaceElementInArray(stateValues, envelope.data));
                }
                    break;
                default:
                    console.error(`unknown element type: ${JSON.stringify(envelope)}`);
            }
        },
        [rooms, functions, stateObjects, stateValues],
    );

    useEffect(() => {
        const roomStructure = createAspectStructure(rooms, 'enum.rooms', functions);
        setRoomAspectNodes(roomStructure);
    }, [rooms, functions]);

    useEffect(() => {
        const functionStructure = createAspectStructure(functions, 'enum.functions', rooms);
        setFunctionAspectNodes(functionStructure);
    }, [functions, rooms]);

    const {sendMessage, connectionState} = useWebSocket(handleNewMessage);

    const sendVuiAction = (vuiActionEnvelope: VuiActionEnvelope) => {
        sendMessage(JSON.stringify(vuiActionEnvelope));
    };

    const contextValue = {
        roomAspectNodes,
        functionAspectNodes,
        stateObjects,
        stateValues,
        connectionState,
        sendVuiAction,
    };

    return <VuiDataContext.Provider value={contextValue}>{children}</VuiDataContext.Provider>;
}
