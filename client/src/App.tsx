import './App.css';
import {hasStateObjects, isRoom, VuiEnum, VuiFunction, VuiRoom} from '../../src/domain';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Icon} from '@mui/material';
import {useCallback, useEffect, useState} from 'react';
import {useVuiDataContext} from '@/vui-data.context';
import {Menu} from './components/ui/menu';
import {Sidebar} from '@/components/ui/sidebar';
import ToggleSwitch from '@/components/ui/toggle-switch';
import {Room} from "@/components/ui/structure/room";
import {createStructure, TreeNode} from "@/domain/logics";


function App() {
    const [roomMode, setRoomMode] = useState<string>('rooms');
    const [roomsStructure, setRoomsStructure] = useState<TreeNode<VuiRoom, VuiFunction>[]>([]);
    const [functionsStructure, setFunctionsStructure] = useState<TreeNode<VuiFunction, VuiRoom>[]>([]);
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode<VuiEnum, VuiEnum>>();

    const {rooms, functions, connectionState} = useVuiDataContext();

    useEffect(() => {
        const roomStructure = createStructure<VuiRoom, VuiFunction>(rooms, 'enum.rooms', functions);
        console.log(roomStructure);
        setRoomsStructure(roomStructure);
    }, [rooms, functions]);

    useEffect(() => {
        const functionStructure = createStructure<VuiFunction, VuiRoom>(functions, 'enum.functions', rooms);
        setFunctionsStructure(functionStructure);
    }, [functions, rooms]);

    // const handleClickSendMessage = useCallback(() => {
    //     sendMessage(`Hello WebSocket!`);
    // }, [sendMessage]);

    const handleToggle = (value: string) => {
        setRoomMode(value);
    };

    const onTreeNodeClicked = useCallback((treeNode: TreeNode<VuiEnum, VuiEnum>) => {
        console.log(treeNode);
        setSelectedTreeNode(treeNode);
        setSheetOpen(false)
    }, [setSelectedTreeNode]);

    const [sheetOpen, setSheetOpen] = useState(false)

    const createContent = useCallback((treeNode: TreeNode<VuiEnum, VuiEnum> | undefined) => {
        const elements: TreeNode<VuiEnum, VuiEnum>[] = [];
        // TODO: Merge inner objects of deeper levels
        if (treeNode && treeNode.basisData && treeNode.level < 2) {
            elements.push(treeNode)
            if (treeNode.children.length > 0) {
                treeNode.children.forEach(node => {
                    if (node && node.basisData && hasStateObjects(node.basisData)) {
                        elements.push(node)
                    }
                })

                // TODO: Collect objects from children ...
            }
        }

        return elements.map(node => {
            const element = node.basisData!
            if (isRoom(element)) {

                return <Room key={element.id} id={element.id} title={element.name}
                             icon={element.icon} sub={node.matchingData ?? []}></Room>
            } else {
                return <Room key={element.id} id={element.id} title={element.name}
                             icon={element.icon} sub={node.matchingData ?? []}></Room>
                // <div key={element.id}>{element.name}</div>
            }
        })
    }, []);

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                                <Sidebar treeNodes={roomMode === 'rooms' ? roomsStructure : functionsStructure}
                                         onTreeNodeClicked={onTreeNodeClicked}/>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Menu/>
                    <div className="ml-auto mr-2 mt-1 "><Icon sx={{
                        fontSize: 24,
                        color: connectionState === 'OPEN' ? '' : 'red'
                    }}>{connectionState === 'OPEN' ? '' : 'cloud_off'}</Icon></div>
                </div>
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-7">
                            <div className="hidden md:block md:col-span-2 lg:col-span-2 xl:col-span-1 col-span-1">
                                <div className="p-4">
                                    <ToggleSwitch
                                        initialValue={roomMode}
                                        left={{value: 'rooms', label: 'Räume'}}
                                        right={{value: 'functions', label: 'Funktionen'}}
                                        onSwitch={handleToggle}
                                    />
                                    <Sidebar treeNodes={roomMode === 'rooms' ? roomsStructure : functionsStructure}
                                             onTreeNodeClicked={onTreeNodeClicked}/>
                                </div>
                            </div>
                            <div className="md:col-span-5 lg:col-span-6 xl:col-span-6 col-span-6 md:border-l">
                                {createContent(selectedTreeNode)}
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
