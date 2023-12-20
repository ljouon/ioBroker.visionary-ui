import {SupplementalAspectCard} from './supplemental-aspect.card';
import {useVuiDataContext} from '@/app/smart-home/data.context';
import {AspectKey, AspectNode, findAspectNode} from '@/app/smart-home/structure/aspect';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {createAspectPath} from '@/app/route-utils';

type MainAspectSectionProps = {
    id: string;
    type: AspectKey;
};

// TODO: Collect objects from children and merge them
// TODO: Section Order

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

export function MainAspectSection({id, type}: MainAspectSectionProps) {
    const navigate = useNavigate();
    const {roomAspectNodes, functionAspectNodes} = useVuiDataContext();
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

    const supplementalAspects =
        element.supplementalAspects?.filter((subElement) => subElement.members && subElement.members.length > 0) || [];

    return (
        <>
            <div className="pt-4 pl-4">
                <h1 className="m- flex items-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    {element.mainAspect.icon ? (
                        <img
                            className="dark:invert h-8 w-8 lg:w-10 lg:h-10 opacity-50"
                            src={element.mainAspect.icon ?? undefined}
                            alt={'icon'}
                        />
                    ) : undefined}
                    <span className="ml-2">{element.mainAspect.name}</span>
                </h1>
            </div>
            <div className="gap-4 rounded-lg p-4 lg:columns-2 xl:columns-3 space-y-6">
                {supplementalAspects?.map((supplementalAspect) => {
                    return (
                        <SupplementalAspectCard
                            title={supplementalAspect.name}
                            key={supplementalAspect.id}
                            id={supplementalAspect.id}
                            functionObjectIds={supplementalAspect.members ?? []}
                            parentId={id}
                            onAspectCardTitleClicked={onAspectCardTitleClicked}
                        />
                    );
                })}
            </div>
        </>
    );
}
