import {VuiEnum} from '../../../../../src/domain';
import {FunctionCard} from '../devices/function-card';

type RoomProps = {
    id: string;
    title: string;
    icon: string | null;
    sub: VuiEnum[];
};

export function Room({id, title, icon, sub}: RoomProps) {
    return (
        <>
            <div className="pt-8 pl-8">
                <h1 className="m- flex items-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    <img
                        className="dark:invert h-8 w-8 lg:w-10 lg:h-10 opacity-50"
                        src={icon ?? undefined}
                        alt={'icon'}
                    />
                    <span className="ml-2">{title}</span>
                </h1>
            </div>
            <div className="gap-6 rounded-lg p-8 lg:columns-2 xl:columns-3 space-y-6">
                {sub
                    .filter((element) => element.members && element.members.length > 0)
                    .map((element) => {
                        return (
                            <FunctionCard
                                title={element.name}
                                key={element.id}
                                id={element.id}
                                parentId={id}
                                functionObjectIds={element.members ?? []}
                            />
                        );
                    })}
            </div>
        </>
    );
}
