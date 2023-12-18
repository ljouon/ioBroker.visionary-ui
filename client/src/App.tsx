import './App.css';
import { hasStateObjects, isRoom, VuiEnum } from '../../src/domain';
import { useCallback, useState } from 'react';
import { useVuiDataContext } from '@/vui-data.context';
import { AspectKey, AspectNode } from '@/domain/aspect';
import { MainAspectSection } from '@/components/domain/main-aspect.section';
import { MainAspectsSidebar } from '@/components/domain/main-aspects.sidebar';
import { TopMenu } from '@/components/domain/top-menu';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { ToggleSwitch } from './components/ui/toggle-switch';
import { Sheet, SheetContent, SheetTrigger } from './__generated__/components/sheet';

export function App() {
    const [mainAspect, setMainAspect] = useState<AspectKey>('rooms');
    const [selectedAspectNode, setSelectedAspectNode] = useState<AspectNode<VuiEnum, VuiEnum>>();
    const { roomAspectNodes, functionAspectNodes, connectionState } = useVuiDataContext();

    const handleToggle = (value: AspectKey) => {
        setMainAspect(value);
    };

    const onAspectNodeClicked = useCallback(
        (aspectNode: AspectNode<VuiEnum, VuiEnum>) => {
            setSelectedAspectNode(aspectNode);
            setSheetOpen(false);
        },
        [setSelectedAspectNode],
    );

    const [sheetOpen, setSheetOpen] = useState(false);

    const elements: AspectNode<VuiEnum, VuiEnum>[] = [];

    if (selectedAspectNode && selectedAspectNode.mainAspect && selectedAspectNode.level < 2) {
        elements.push(selectedAspectNode);
        if (selectedAspectNode.children.length > 0) {
            selectedAspectNode.children.forEach((node) => {
                if (node && node.mainAspect && hasStateObjects(node.mainAspect)) {
                    elements.push(node);
                }
            });
        }
    }

    const pageContent = elements.map((node) => {
        const element = node.mainAspect!;
        return <MainAspectSection key={element.id} id={element.id} type={isRoom(element) ? 'room' : 'function'} />;
    });

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger className="block md:hidden">
                            <div className="ml-3 mt-1">
                                <DynamicIcon className={'w-8 h-8 accent-gray-300 opacity-50'} iconKey="menu" />
                            </div>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[300px] overflow-y-auto	">
                            <div className="p-2">
                                <ToggleSwitch
                                    initialValue={mainAspect}
                                    left={{ value: 'rooms', label: 'Räume' }}
                                    right={{ value: 'functions', label: 'Funktionen' }}
                                    onSwitch={handleToggle}
                                />
                                <MainAspectsSidebar
                                    aspectNodes={mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes}
                                    onAspectNodeClicked={onAspectNodeClicked}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <TopMenu />
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
                                        initialValue={mainAspect}
                                        left={{ value: 'rooms', label: 'Räume' }}
                                        right={{ value: 'functions', label: 'Funktionen' }}
                                        onSwitch={handleToggle}
                                    />
                                    <MainAspectsSidebar
                                        aspectNodes={mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes}
                                        onAspectNodeClicked={onAspectNodeClicked}
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
        </div>
    );
}
