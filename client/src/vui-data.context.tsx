import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { VuiEnvelope, VuiFunction, VuiRoom, VuiStateObject, VuiStateValue } from '../../src/domain';
import useWebSocket, { ConnectionState } from './useWebsocket';
import { createStructure, TreeNode } from '@/domain/logics';

export type VuiDataContextType = {
    roomTreeList: TreeNode<VuiRoom, VuiFunction>[];
    functionTreeList: TreeNode<VuiFunction, VuiRoom>[];
    stateObjects: VuiStateObject[];
    stateValues: VuiStateValue[];
    connectionState: ConnectionState;
    sendMessage: (message: string) => void;
};

const noop = () => {};

const VuiDataContext = createContext<VuiDataContextType>({
    roomTreeList: [],
    functionTreeList: [],
    stateObjects: [],
    stateValues: [],
    connectionState: 'UNKNOWN',
    sendMessage: noop, // Will be replaced by the correct implementation below
});

export type VuiDataProviderProps = {
    children: ReactNode;
};

export function VuiDataProvider({ children }: VuiDataProviderProps) {
    const [rooms, setRooms] = useState<VuiRoom[]>([]);
    const [functions, setFunctions] = useState<VuiFunction[]>([]);
    const [stateObjects, setStateObjects] = useState<VuiStateObject[]>([]);
    const [stateValues, setStateValues] = useState<VuiStateValue[]>([]);
    const [roomTreeList, setRoomTreeList] = useState<TreeNode<VuiRoom, VuiFunction>[]>([]);
    const [functionTreeList, setFunctionTreeList] = useState<TreeNode<VuiFunction, VuiRoom>[]>([]);

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
        [rooms, functions, stateObjects, stateValues],
    );

    useEffect(() => {
        const roomStructure = createStructure<VuiRoom, VuiFunction>(rooms, 'enum.rooms', functions);
        setRoomTreeList(roomStructure);
    }, [rooms, functions]);

    useEffect(() => {
        const functionStructure = createStructure<VuiFunction, VuiRoom>(functions, 'enum.functions', rooms);
        setFunctionTreeList(functionStructure);
    }, [functions, rooms]);

    const { sendMessage, connectionState } = useWebSocket(handleNewMessage);

    const contextValue = {
        roomTreeList,
        functionTreeList,
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
