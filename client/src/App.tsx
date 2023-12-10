import './App.css';
import { VuiEnum, VuiFunction, VuiRoom } from '../../src/domain.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { Icon } from '@mui/material';
import { useEffect, useState } from 'react';
import { useVuiDataContext } from '@/vui-data.context.tsx';
import { Menu } from './components/ui/menu.tsx';
import { Sidebar } from '@/components/ui/sidebar.tsx';
import ToggleSwitch from '@/components/ui/toggle-switch.tsx';

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
                childNode = { data: isLeaf ? element : null, canonicalPath, level, children: [] };
                currentLevelNodes.push(childNode);
            }

            currentLevelNodes = childNode.children;
        });
    });

    return firstLevelNodes;
}

function App() {
    const [roomMode, setRoomMode] = useState<boolean>(true);
    const [roomsStructure, setRoomsStructure] = useState<TreeNode<VuiEnum>[]>([]);
    const [functionsStructure, setFunctionsStructure] = useState<TreeNode<VuiEnum>[]>([]);

    const { rooms, functions } = useVuiDataContext();

    useEffect(() => {
        const roomStructure = createStructure<VuiRoom>(rooms, 'enum.rooms');
        setRoomsStructure(roomStructure);
    }, [rooms]);

    useEffect(() => {
        const functionStructure = createStructure<VuiFunction>(functions, 'enum.functions');
        console.log(functionStructure);
        setFunctionsStructure(functionStructure);
    }, [functions]);

    // const handleClickSendMessage = useCallback(() => {
    //     sendMessage(`Hello WebSocket!`);
    // }, [sendMessage]);

    // const roomStructure = createStructure<VuiRoom>(rooms, 'enum.rooms');

    console.log('roomStructure');
    //
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
        setRoomMode(value === 'rooms');
    };

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet>
                        <SheetTrigger className="block md:hidden">
                            <div className="ml-3 mt-1">
                                <Icon sx={{ fontSize: 28 }}>menu</Icon>
                            </div>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[300px] overflow-y-auto	">
                            <div className="p-4">
                                <ToggleSwitch
                                    initialValue="rooms"
                                    left={{ value: 'rooms', label: 'Räume' }}
                                    right={{ value: 'functions', label: 'Funktionen' }}
                                    onSwitch={handleToggle}
                                />
                                <Sidebar treeNodes={roomMode ? roomsStructure : functionsStructure} />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Menu />
                    <div className="ml-auto mr-2">Text rechts</div>
                </div>
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid md:grid-cols-4">
                            <div className="hidden md:block">
                                <div className="p-4">
                                    <ToggleSwitch
                                        initialValue="rooms"
                                        left={{ value: 'rooms', label: 'Räume' }}
                                        right={{ value: 'functions', label: 'Funktionen' }}
                                        onSwitch={handleToggle}
                                    />
                                </div>
                                <Sidebar treeNodes={roomMode ? roomsStructure : functionsStructure} />
                            </div>
                            <div className="col-span-3 sm:col-span-3 md:border-l">
                                <div className="h-full px-4 py-6 sm:px-8">
                                    <Tabs defaultValue="music" className="h-full space-y-6">
                                        <div className="space-between flex items-center">
                                            <TabsList>
                                                <TabsTrigger value="music" className="relative">
                                                    Music
                                                </TabsTrigger>
                                                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                                                <TabsTrigger value="live" disabled>
                                                    Live
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>
                                        <TabsContent value="music" className="border-none p-0 outline-none">
                                            <div className="flex items-center justify-between">inhalt</div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
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
