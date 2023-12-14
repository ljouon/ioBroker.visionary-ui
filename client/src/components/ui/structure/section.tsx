import { useVuiDataContext } from '@/vui-data.context';
import { TreeNode } from '@/domain/logics';
import { VuiEnum } from '../../../../../src/domain';
import { DeviceCard } from '@/components/ui/devices/device-card';

type SectionProps = {
    id: string;
    type: 'room' | 'function';
};

// TODO: Collect objects from children and merge them
// TODO: Section Order

function findNodeById(nodes: TreeNode<VuiEnum, VuiEnum>[], id: string): TreeNode<VuiEnum, VuiEnum> | null {
    let result = null;
    for (const node of nodes) {
        if (node.basisData && node.basisData.id === id) {
            result = node;
            break;
        }

        if (node.children.length > 0) {
            const subNode = findNodeById(node.children, id);
            if (subNode) {
                result = subNode;
                break;
            }
        }
    }
    return result;
}

export function Section({ id, type }: SectionProps) {
    const { roomTreeList, functionTreeList } = useVuiDataContext();

    let element = undefined;
    if (type === 'room') {
        element = findNodeById(roomTreeList, id);
    } else if (type === 'function') {
        element = findNodeById(functionTreeList, id);
    }

    const devices =
        element?.matchingData?.filter((subElement) => subElement.members && subElement.members.length > 0) || [];

    return (
        <>
            <div className="pt-8 pl-8">
                <h1 className="m- flex items-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    <img
                        className="dark:invert h-8 w-8 lg:w-10 lg:h-10 opacity-50"
                        src={element?.basisData?.icon ?? undefined}
                        alt={'icon'}
                    />
                    <span className="ml-2">{element?.basisData?.name}</span>
                </h1>
            </div>
            <div className="gap-6 rounded-lg p-8 lg:columns-2 xl:columns-3 space-y-6">
                {devices?.map((element) => {
                    return (
                        <DeviceCard
                            title={element.name}
                            key={element.id}
                            id={element.id}
                            sectionId={id}
                            functionObjectIds={element.members ?? []}
                        />
                    );
                })}
            </div>
        </>
    );
}
