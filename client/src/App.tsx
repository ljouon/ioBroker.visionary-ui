import { ReactNode, useCallback, useState } from 'react';
import './App.css';
import { useVuiDataContext } from './vui-data.context.tsx';
import { VuiEnum, VuiFunction, VuiRoom } from '../../src/domain.ts';
import { Sidebar } from '@/components/ui/sidebar.tsx';

export type TreeNode<T> = {
    level: number;
    canonicalPath: string;
    data: T | null;
    children: TreeNode<T>[];
};

function App() {
    const [count, setCount] = useState<number>(0);

    const { rooms, functions, stateObjects, stateValues, connectionState, sendMessage } = useVuiDataContext();

    const handleClickSendMessage = useCallback(
        (counter: number) => {
            const newCount = counter + 1;
            setCount(newCount);
            sendMessage(`Hello WebSocket! ${newCount}`);
        },
        [sendMessage],
    );

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

    const roomStructure = createStructure<VuiRoom>(rooms, 'enum.rooms');
    console.log(roomStructure);
    const functionStructure = createStructure<VuiFunction>(functions, 'enum.functions');
    console.log(functionStructure);

    function mapToTreeView<T extends VuiEnum>(roomStructure: TreeNode<T>[]): ReactNode {
        return roomStructure.map((node) => {
            const classNames = `text-sm text-gray-500 pl-${node.level * 4}`;

            return (
                <div key={node.canonicalPath}>
                    <div className={classNames}>{node.data?.name}</div>
                    {mapToTreeView<T>(node.children)}
                </div>
            );
        });
    }

    return (
        <>
            <div className="md:hidden"></div>
            <div className="hidden md:block">
                {/*<Menu />*/}
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Sidebar treeNodes={roomStructure} className="hidden lg:block" />
                        </div>
                    </div>
                </div>
            </div>
            {/*<div>*/}
            {/*    <a href="https://vitejs.dev" target="_blank">*/}
            {/*        <img src={viteLogo} className="logo" alt="Vite logo" />*/}
            {/*    </a>*/}
            {/*    <a href="https://react.dev" target="_blank">*/}
            {/*        <img src={reactLogo} className="logo react" alt="React logo" />*/}
            {/*    </a>*/}
            {/*</div>*/}
            {/*<h1>Client with websocket connection</h1>*/}
            {/*<h2 className="text-2xl font-bold">Hello world!</h2>*/}

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
        </>
    );
}

export default App;
