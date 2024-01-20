import { SupplementalAspectCard } from './supplemental-aspect.card';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { AspectKey, AspectNode, findAspectNode, sortObjectsByRank } from '@/app/smart-home/structure/aspect';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAspectPath } from '@/app/route-utils';
import { VuiEnumIcon } from '@/app/components/vui-enum-icon';
import { Separator } from '@/__generated__/components/separator';
import { ThemeContext } from '@/app/theme/theme-provider';
import { VuiEnum } from '../../../../../src/domain';

type MainAspectSectionProps = {
    id: string;
    type: AspectKey;
};

// TODO: Collect objects from children and merge them

function findNodeInAspect(
    roomAspectNodes: AspectNode[],
    functionAspectNodes: AspectNode[],
    type: AspectKey,
    id: string,
): AspectNode | null {
    let element = null;
    if (type === 'rooms') {
        element = findAspectNode(roomAspectNodes, (node: AspectNode) => id === node.mainAspect?.id);
    } else if (type === 'functions') {
        element = findAspectNode(functionAspectNodes, (node: AspectNode) => id === node.mainAspect?.id);
    }
    return element;
}

function prepareAspectNodes(element: AspectNode): VuiEnum[] {
    return (
        element.supplementalAspects
            ?.filter((subElement) => subElement.members && subElement.members.length > 0)
            .sort((a, b) => sortObjectsByRank(a, b)) || []
    );
}

export function MainAspectSection({ id, type }: MainAspectSectionProps) {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { roomAspectNodes, functionAspectNodes } = useVuiDataContext();
    const element = findNodeInAspect(roomAspectNodes, functionAspectNodes, type, id);

    const onAspectCardTitleClicked = useCallback(
        (aspectId: string) => {
            const otherAspect = type === 'rooms' ? 'functions' : 'rooms';
            const canonicalPath = findNodeInAspect(roomAspectNodes, functionAspectNodes, otherAspect, aspectId)
                ?.canonicalPath;
            if (canonicalPath) {
                navigate(createAspectPath(otherAspect, canonicalPath));
            }
        },
        [roomAspectNodes, functionAspectNodes, navigate, type],
    );

    if (!element || !element?.mainAspect) {
        return;
    }
    const supplementalAspects = prepareAspectNodes(element);

    return (
        <>
            <div className="pt-4 pl-4">
                <h1 className="flex items-center text-lg font-bold leading-none text-gray-900 md:text-xl lg:text-2xl dark:text-white bg-red-300">
                    <VuiEnumIcon element={element.mainAspect} size={16} />
                    <span className="ml-2">{element.mainAspect.name}</span>
                </h1>
            </div>
            <Separator
                className="w-16 ml-4 h-1.5 my-1"
                style={theme !== 'dark' ? { backgroundColor: element.mainAspect.color || '' } : {}}
            />
            <div className="gap-4 rounded-lg p-4 lg:columns-2 xl:columns-3 space-y-6">
                {supplementalAspects?.map((supplementalAspect) => {
                    return (
                        <SupplementalAspectCard
                            element={supplementalAspect}
                            key={supplementalAspect.id}
                            parentId={id}
                            onAspectCardTitleClicked={onAspectCardTitleClicked}
                        />
                    );
                })}
            </div>
        </>
    );
}
