import {SupplementalAspectCard} from './supplemental-aspect.card';
import {useVuiDataContext} from '@/app/smart-home/data.context';
import {findAspectNodeById} from "@/app/smart-home/structure/aspect";

type MainAspectSectionProps = {
    id: string;
    type: 'room' | 'function';
};

// TODO: Collect objects from children and merge them
// TODO: Section Order

export function MainAspectSection({id, type}: MainAspectSectionProps) {
    const {roomAspectNodes, functionAspectNodes} = useVuiDataContext();

    let element = undefined;
    if (type === 'room') {
        element = findAspectNodeById(roomAspectNodes, id);
    } else if (type === 'function') {
        element = findAspectNodeById(functionAspectNodes, id);
    }

    if (!element || !element?.mainAspect) {
        return;
    }

    const supplementalAspects =
        element.supplementalAspects?.filter((subElement) => subElement.members && subElement.members.length > 0) || [];

    return (
        <>
            <div className="pt-6 pl-8">
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
            <div className="gap-6 rounded-lg p-8 lg:columns-2 xl:columns-3 space-y-6">
                {supplementalAspects?.map((supplementalAspect) => {
                    return (
                        <SupplementalAspectCard
                            title={supplementalAspect.name}
                            key={supplementalAspect.id}
                            id={supplementalAspect.id}
                            sectionId={id}
                            functionObjectIds={supplementalAspect.members ?? []}
                        />
                    );
                })}
            </div>
        </>
    );
}
