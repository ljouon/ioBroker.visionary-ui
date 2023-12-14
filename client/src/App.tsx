import './App.css';
import { hasStateObjects, isRoom, VuiEnum } from '../../src/domain';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useCallback, useState } from 'react';
import { useVuiDataContext } from '@/vui-data.context';
import { Menu } from './components/ui/menu';
import { Sidebar } from '@/components/ui/sidebar';
import ToggleSwitch from '@/components/ui/toggle-switch';
import { Section } from '@/components/ui/structure/section';
import { TreeNode } from '@/domain/logics';
import { DynamicIcon } from '@/components/ui/icons/DynamicIcon';

function App() {
    const [roomMode, setRoomMode] = useState<string>('rooms');
    const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode<VuiEnum, VuiEnum>>();
    const { roomTreeList, functionTreeList, connectionState } = useVuiDataContext();

    const handleToggle = (value: string) => {
        setRoomMode(value);
    };

    const onTreeNodeClicked = useCallback(
        (treeNode: TreeNode<VuiEnum, VuiEnum>) => {
            setSelectedTreeNode(treeNode);
            setSheetOpen(false);
        },
        [setSelectedTreeNode],
    );

    const [sheetOpen, setSheetOpen] = useState(false);

    const elements: TreeNode<VuiEnum, VuiEnum>[] = [];

    if (selectedTreeNode && selectedTreeNode.basisData && selectedTreeNode.level < 2) {
        elements.push(selectedTreeNode);
        if (selectedTreeNode.children.length > 0) {
            selectedTreeNode.children.forEach((node) => {
                if (node && node.basisData && hasStateObjects(node.basisData)) {
                    elements.push(node);
                }
            });
        }
    }

    const pageContent = elements.map((node) => {
        const element = node.basisData!;
        return <Section key={element.id} id={element.id} type={isRoom(element) ? 'room' : 'function'} />;
    });

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger className="block md:hidden">
                            <div className="ml-3 mt-1">
                                <DynamicIcon className={'w-8 h-8 dark:invert opacity-50'} iconKey="menu" />
                            </div>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[300px] overflow-y-auto	">
                            <div className="p-2">
                                <ToggleSwitch
                                    initialValue={roomMode}
                                    left={{ value: 'rooms', label: 'Räume' }}
                                    right={{ value: 'functions', label: 'Funktionen' }}
                                    onSwitch={handleToggle}
                                />
                                <Sidebar
                                    treeNodes={roomMode === 'rooms' ? roomTreeList : functionTreeList}
                                    onTreeNodeClicked={onTreeNodeClicked}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Menu />
                    <div className="ml-auto mr-2 mt-1 ">
                        <DynamicIcon
                            className={'w-2 h-2 dark:invert opacity-50'}
                            iconKey={connectionState === 'OPEN' ? '' : 'cloud_off'}
                        />
                    </div>
                </div>
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-7">
                            <div className="hidden md:block md:col-span-2 lg:col-span-2 xl:col-span-1 col-span-1">
                                <div className="p-2">
                                    <ToggleSwitch
                                        initialValue={roomMode}
                                        left={{ value: 'rooms', label: 'Räume' }}
                                        right={{ value: 'functions', label: 'Funktionen' }}
                                        onSwitch={handleToggle}
                                    />
                                    <Sidebar
                                        treeNodes={roomMode === 'rooms' ? roomTreeList : functionTreeList}
                                        onTreeNodeClicked={onTreeNodeClicked}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-5 lg:col-span-6 xl:col-span-6 col-span-6 md:border-l">
                                {pageContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="card">*/}
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
