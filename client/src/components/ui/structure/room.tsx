import {VuiEnum} from "../../../../../src/domain";
import {FunctionCard} from "../devices/function-card";

type RoomProps = {
    id: string
    title: string
    icon: string | null
    sub: VuiEnum[]
}

export function Room({id, title, icon, sub}: RoomProps) {
    return (
        <>
            <div className="pt-8 pl-8">
                <h1
                    className="m- flex items-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    <img
                        className="dark:invert h-8 w-8 lg:w-10 lg:h-10"
                        src={icon ?? undefined}
                        alt={'icon'}
                    />
                    <span className="ml-2">{title}</span></h1>
            </div>
            <div
                className="items-start justify-center gap-6 rounded-lg p-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                {/*<div className="h-full px-4 py-6 sm:px-8">*/}
                {/*    <div className="flex items-center justify-center [&>div]:w-full">*/}
                {sub.map(element => {
                    return <FunctionCard title={element.name} key={element.id} id={element.id} roomId={id}
                                         objects={element.members ?? []}/>
                })}
                {/*<FunctionCard title='Licht' id='light' roomId={id}/>*/}
                {/*<FunctionCard title='Heizung' id='heating' roomId={id}/>*/}
                {/*<FunctionCard title='Fenster' id='windows' roomId={id}/>*/}
                {/*<FunctionCard title='Sicherheit' id='security' roomId={id}/>*/}
                {/*<FunctionCard title='Sonstiges' id='other' roomId={id}/>*/}
                {/*<FunctionCard title='Wetter' id='weather' roomId={id}/>*/}
                {/*<FunctionCard title='Systeme' id='systems' roomId={id}/>*/}
                {/*<FunctionCard title='Waschen' id='wasching' roomId={id}/>*/}
                {/*</div>*/}
            </div>
        </>
    );
}