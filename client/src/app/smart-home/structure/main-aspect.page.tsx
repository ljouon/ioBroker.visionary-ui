import { useNavigate, useParams } from 'react-router-dom';
import { AspectNode, findAspectNode } from '@/app/smart-home/structure/aspect';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { MainAspectSection } from '@/app/smart-home/structure/main-aspect.section';
import { hasStateObjects, isRoom } from '../../../../../src/domain';
import { matchPath } from '@/app/route-utils';
import { useEffect, useState } from 'react';
import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';

export function MainAspectPage() {
    const { mainAspect, canonicalPath } = useParams();
    const { roomAspectNodes, functionAspectNodes } = useVuiDataContext();
    const navigate = useNavigate();
    const [error, setError] = useState<boolean>(false);
    const [selectedAspectNode, setSelectedAspectNode] = useState<AspectNode | null>(null);

    useEffect(() => {
        const nodes = mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes;
        if (roomAspectNodes.length > 0 && functionAspectNodes.length > 0) {
            const result = findAspectNode(nodes, (node: AspectNode) => {
                return matchPath(canonicalPath || '', node.canonicalPath);
            });
            if (result) {
                setSelectedAspectNode(result);
                setError(false);
            } else {
                setError(true);
            }
        }
    }, [roomAspectNodes, functionAspectNodes, mainAspect, canonicalPath]);

    if (error) {
        return (
            <div className="pt-4 pl-4" onClick={() => navigate('/home')}>
                <h1 className="m- flex items-center text-lg font-bold leading-none  text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    <DynamicMaterialDesignIcon
                        iconKey="alert-circle-outline"
                        className="h-16 w-16 text-red-500 bg-white rounded-xl p-1 mt-4"
                    />
                    <span className="ml-4">Element not found, please navigate back...</span>
                </h1>
            </div>
        );
    } else {
        const mainAspects: AspectNode[] = [];

        if (selectedAspectNode && selectedAspectNode.mainAspect && selectedAspectNode.level < 2) {
            mainAspects.push(selectedAspectNode);
            if (selectedAspectNode.children.length > 0) {
                selectedAspectNode.children.forEach((node: AspectNode) => {
                    if (node && node.mainAspect && hasStateObjects(node.mainAspect)) {
                        mainAspects.push(node);
                    }
                });
            }
        }

        return (
            <>
                {mainAspects
                    .map((node) => node.mainAspect!)
                    .map((element) => {
                        return (
                            <MainAspectSection
                                key={element.id}
                                id={element.id}
                                type={isRoom(element) ? 'rooms' : 'functions'}
                            />
                        );
                    })}
            </>
        );
    }
}
