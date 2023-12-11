import './App.css';
import {VuiEnum, VuiFunction, VuiRoom} from '../../src/domain';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Icon} from '@mui/material';
import {useEffect, useState} from 'react';
import {useVuiDataContext} from '@/vui-data.context';
import {Menu} from './components/ui/menu';
import {Sidebar} from '@/components/ui/sidebar';
import ToggleSwitch from '@/components/ui/toggle-switch';
import {Room} from "@/components/ui/structure/room";

export type TreeNode<T> = {
    level: number;
    canonicalPath: string;
    data: T | null;
    children: TreeNode<T>[];
};

function getPathSegments(id: string, prefix: string): string[] {
    return id.replace(prefix, '').split('.').filter(Boolean);
}

function buildCanonicalPath(segments: string[], index: number): string {
    return segments.slice(0, index + 1).join('.');
}

function createStructure<T extends VuiEnum>(elements: T[], prefix: string): TreeNode<T>[] {
    const sortedElements = elements.sort((a, b) => a.id.localeCompare(b.id));
    const firstLevelNodes: TreeNode<T>[] = [];

    sortedElements.forEach((element) => {
        const pathSegments = getPathSegments(element.id, prefix);
        let currentLevelNodes = firstLevelNodes;

        pathSegments.forEach((_, level) => {
            const isLeaf = level === pathSegments.length - 1;
            const canonicalPath = buildCanonicalPath(pathSegments, level);
            let childNode = currentLevelNodes.find((node) => node.canonicalPath === canonicalPath);
            if (!childNode) {
                childNode = {data: isLeaf ? element : null, canonicalPath, level, children: []};
                currentLevelNodes.push(childNode);
            }

            currentLevelNodes = childNode.children;
        });
    });

    return firstLevelNodes;
}

function App() {
    const [roomMode, setRoomMode] = useState<string>('rooms'); // TODO: Initial value not correct on resize of window
    const [roomsStructure, setRoomsStructure] = useState<TreeNode<VuiEnum>[]>([]);
    const [functionsStructure, setFunctionsStructure] = useState<TreeNode<VuiEnum>[]>([]);

    const {rooms, functions, connectionState} = useVuiDataContext();

    useEffect(() => {
        const roomStructure = createStructure<VuiRoom>(rooms, 'enum.rooms');
        setRoomsStructure(roomStructure);
    }, [rooms]);

    useEffect(() => {
        const functionStructure = createStructure<VuiFunction>(functions, 'enum.functions');
        setFunctionsStructure(functionStructure);
    }, [functions]);

    // const handleClickSendMessage = useCallback(() => {
    //     sendMessage(`Hello WebSocket!`);
    // }, [sendMessage]);

    // const roomStructure = createStructure<VuiRoom>(rooms, 'enum.rooms');

    // const functionStructure = createStructure<VuiFunction>(functions, 'enum.functions');
    //
    // // console.log(functionStructure);
    //
    // function mapToTreeView<T extends VuiEnum>(roomStructure: TreeNode<T>[]): ReactNode {
    //     return roomStructure.map((node) => {
    //         const classNames = `text-sm text-gray-500 pl-${node.level * 4}`;
    //
    //         return (
    //             <div key={node.canonicalPath}>
    //                 <div className={classNames}>{node.data?.name}</div>
    //                 {mapToTreeView<T>(node.children)}
    //             </div>
    //         );
    //     });
    // }

    const handleToggle = (value: string) => {
        setRoomMode(value);
    };

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet>
                        <SheetTrigger className="block md:hidden">
                            <div className="ml-3 mt-1">
                                <Icon sx={{fontSize: 28}}>menu</Icon>
                            </div>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[300px] overflow-y-auto	">
                            <div className="p-4">
                                <ToggleSwitch
                                    initialValue={roomMode}
                                    left={{value: 'rooms', label: 'Räume'}}
                                    right={{value: 'functions', label: 'Funktionen'}}
                                    onSwitch={handleToggle}
                                />
                                <Sidebar treeNodes={roomMode ? roomsStructure : functionsStructure}/>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Menu/>
                    <div className="ml-auto mr-2 mt-1 "><Icon sx={{
                        fontSize: 24,
                        color: connectionState === 'OPEN' ? 'darkblue' : 'gray'
                    }}>{connectionState === 'OPEN' ? 'sync' : 'sync_problem'}</Icon></div>
                </div>
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid md:grid-cols-4">
                            <div className="hidden md:block">
                                <div className="p-4">
                                    <ToggleSwitch
                                        initialValue={roomMode}
                                        left={{value: 'rooms', label: 'Räume'}}
                                        right={{value: 'functions', label: 'Funktionen'}}
                                        onSwitch={handleToggle}
                                    />
                                </div>
                                <Sidebar treeNodes={roomMode ? roomsStructure : functionsStructure}/>
                            </div>
                            <div className="col-span-3 sm:col-span-3 md:border-l">
                                <Room id="living_room" title="Wohnzimmer"
                                      icon="data:image/png;base64,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"></Room>
                                <Room id="kitchen" title="Küche"
                                      icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAAAXNSR0IArs4c6QAACO5JREFUeJztnUuIHEUYx38Zg68EnQTBiAqDIviECT5yiCQbJBEFcbwru+rFg5qNF1GErCBecsgGRCWHuOpFEEkCehElG81B8bEjPhAf7IqPRHxkA1GzEtRDbZvN7HTX193VVV2z3w/qkN2aqi/d/6366quvapZRnk3AeuAy4NIF5VwHbSvpfAHsBnaFNsTGCuBx4CDwr5bg5bns1xWWYeAw4R+SltPLhqyX5pKGsN56zBA4AaypzhylIB1fHUkE8wRwCLiqYluU4lzhq6Pllt/vBEZ9GKKU4tvQBoDxvkPPzVpkZV3KO/TGQ4R/CFpk5b6Ud1gJy/r8bDPwZok2vwd+Ak6UaEPJZg74BtgDfBTSkCuBY+RT+I/ADuDmAPYqgfkAuVCOA9uBc4JYqgSng1wsXaAVxkylLnyOTCwvhTJQqQ/3IBPLJHBGIBuVGnEIu1imgfNCGajUhxXASeyC2RzKQKVeSJzdT4NZp9SKBrBFUG9P1YYo8fAO9hHmmmDWKbXjM7LF8nc405S60QBWW+r87MMQJQ4aQNNS57APQ5Q4aGDfC/rThyFKHEhzehUFUMEoOVHBKLmwJYH7pgXciXHEh+Z/NotJp5gB9s//W3FPC9jIqbSVNuY9dDGHFvclFSU71FUzjNnclOyY7+WUmJRytDEnQ6awP/edyYdCCqYNHBDY0K+8gD0koPRniGLPfQRBpaoEMwQcLWD0wjKFZv7loYUZoYs+70mklRwzVMLo3nIUHWkkdCj/B/ovggquBdN2ZHjvSKOiSWcrbp5zF0El14Ip6rPYyphjOweFF3D3jMcRVHIpmBGHxvcr6s+czjjunm03adSnYKRL51J/AQrg7o+zS8/o7UswrRxGjmJ8HTAO8oTwc9OObI2dNvmFMYsJzo1gnnmqT+hLMKNCw9sVfX4pkXckHyPHosGXYMYEfdnuotknaGOpR4Elz3nhdJPL7/O5+Sh5kTZxSsS7lAXTxCyhJezHPKuZPB3UbfOxW/L3S51RZFPLJxS8F0/TGwaLYUGd7ygxCqtgBoc2Mn9klBIpIiqYwUEyapyW11KEuvkwdWQZcC3mruKfMDd0ZfEdOR1JR0h8ktKBTRVMNrcDrwFnF/hsFxNw3I8fAW0U1CkdItEpKZ11wOsUEwsYn2IcE0TbSfjd9IM4SG9VwaTzKv1vGS3CKEY4VUWhJWJ0kgutgknnIsftNTGpHSOO2wWZEJ3EsFQw6VTh3zUx01O0+10qGP8kI01on6YQKpgwNIk0Q1AFE46tRJghWLc4zHbL7+v0gGeAF3t+1sT4J5KYCJhgW1RZgnUTTEzD9Azp9nYwQbvzLW0ME5lgfE5JdRNnlSSpjjaiWy35FMwlnvqpy7S1DxNdtVEXe0X4FMxKT/3U6UtMJcEyFUwKJz31U6cv9hq4q0l8Cua4p36OeOqnTkhGMif+kk/B/OCpn6UoGMlI5iSyrIG7pcNGHIimbkvdTZbfJzcmKYs5iD1gmMSHClM3wfi4Hs0nkjxbV9l4+7ALZpiSgtEpqTqGkG0RuBKM9JBfofNICSqYamhj7mWx8YnDPruYBHQbpdJF6zYlxcTFwMM9P2tjAoe3CdtwPQVPINvAPQCsLdqJr8P4k4K+bEjuxnO1gZn3uowixXWUt4lZYkv63kuBkUanpHC8iPvjJ7PId787mJGmtrc3KKc4RnWpHGPIfBkwU+g0ZhoTjTYqmDB0qPZwW96V0BjmZtO9mKV3apBPBTOYdIF7C3wuCexNcupq3CkWBEtVMGHYS/VpDRPALgfttDEH8aZABRMKX6cGRlmcd1yUNjCuggnHMH6Sp0aAbY7a2qiBu+LMsjhSewQzetwqbGMU+0WQLhjHONmSxPQs2lCfWzSl/fi6RdPWz4GMz7YxL8jWxpQjW6W0kN95nPqOfAmmTXYUUnpIPes/3MXdEdQyggH5N7aEYAhZ5L3vO/IlGOY77CeaPGdzmvT/z87g9thGWcGQYmdvCZkEntxh0+1jV9935NuHmZg3roNReReTx5FHlLPzn02ul08ENEH9kq4nsac4tAhzxRmY55/4UC3Mc+33nY//v6MQTm8XN3eVRHViMAISpzgTXVYruVDBKLlQwSi5UMFUS5S3TGWhgqkWyTI/1AqpECqY6ujg99SAF1Qw1dDB/6kBL+jmY3FaLM7Qb2KCX9KIc6lDZaHwuTUQE0U36PKUqO6GAZ2SQrKLyPyXBB1h+lPlyDJLpEtuHWH8cwzj59Rto1SECiadfypo8xhmdzjaLzvVVVI6vwAXOmwvGVmiFQvoCJPFnQ7behKzIopaLAnq9KZzC+ZWziKObZKcFN3SOQudkrJ5GzgH8yWhNwOHsTurM0S6XJaiI4wiRn0YJRcqGCUXKhglFyoYJRcqGCUXKhglFyoYJRdFAne3YcLmbeACYDWwyqVRiogvgN24uWUqF5LA3SrgGeAPQX0tfsuzi19pdSyb7zSLI8CZmJFEqScbgHd9dCTxYdagYqk7d/nqSJ3eweAKXx2pYAaDb3x1pIIZDF7x1ZEKJn7uB9731ZmLBKoTmOyyOQdtLUXa2K9CPdjz7znMNLQH+KgKo7IosvafAR4Ervdt7ADi4nukvJJHKHPAU8BZQSwdTKISTN4paR0DkvmuFCOP0/soKhYF2VT0IWYbQXFPVFOSdITZQc0MV8IgFYz3pZtSTySCSdb8iiISzF+VW6FEQwM4aamz0ochShw0gF8tdZYDl3mwRYmABvCZoN7aqg1R4qABfCyotw2NwygYwbwuqLceeKRiW5SISL4F3VauC2XgABNlpPd5Yf33gAcqskWJiPPJ/sbX3vIGcBNwbghjB4yoRpiFjuxjwNMF2jgCfIs9nqP0J7qMu4UcIvxJPi35ynDfN1kRvUvlVZhl9kDd/DjgzAFXAdM+OuvdSzoKbAF+99G54oSzgHt9ddZv8/Fr4AbgS19GKKXxFu5I262eBm4E3vJliFKK33x1lJXecBzYDNwNfOXHHKUgb4c2oB/3AG8SflWg5fTyctZLc02RDcWVwB2YwN3VwOXzRfFLkBuo/gPZwrGz1CscJAAAAABJRU5ErkJggg=="></Room>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="card">*/}
            {/*    <Icon sx={{ fontSize: 50 }}>camera</Icon>*/}

            {/*    <p>*/}
            {/*        {connectionState === 'OPEN' ? (*/}
            {/*            <Icon sx={{ fontSize: 50 }}>sync</Icon>*/}
            {/*        ) : (*/}
            {/*            <Icon sx={{ fontSize: 50 }}>sync_problem</Icon>*/}
            {/*        )}*/}
            {/*    </p>*/}
            {/*    <Button disabled={connectionState !== 'OPEN'} onClick={() => handleClickSendMessage(count)}>*/}
            {/*        count is {count}*/}
            {/*    </Button>*/}
            {/*</div>*/}
            {/*<ul>*/}
            {/*    <p>Rooms: {rooms.length}</p>*/}
            {/*    <p>Functions: {functions.length}</p>*/}
            {/*    <p>Objects: {stateObjects.length}</p>*/}
            {/*    <p>States: {stateValues.length}</p>*/}
            {/*</ul>*/}

            {/*{mapToTreeView<VuiRoom>(roomStructure)}*/}
            {/*<ul>*/}
            {/*    <SubComponent />*/}
            {/*</ul>*/}
        </div>
    );
}

export default App;
