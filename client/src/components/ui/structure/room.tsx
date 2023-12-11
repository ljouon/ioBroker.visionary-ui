import {FunctionCard} from "../devices/function-card";

type RoomProps = {
    id: string
    title: string
    icon: string | undefined
}

export function Room({id, title, icon}: RoomProps) {
    return (
        <>
            <div className="pl-4 pt-4 sm:pl-8">
                <h1
                    className="m- flex items-center text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    <img
                        className="dark:invert w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                        src={icon ?? undefined}
                        alt={'icon'}
                    />
                    <span className="ml-2">{title}</span></h1>
            </div>
            <div className="items-start justify-center gap-6 rounded-lg p-8 grid lg:grid-cols-2 2xl:grid-cols-3">
                {/*<div className="h-full px-4 py-6 sm:px-8">*/}
                {/*    <div className="flex items-center justify-center [&>div]:w-full">*/}
                <FunctionCard title='Licht' id='light' roomId={id}/>
                <FunctionCard title='Thermostate' id='Thermostate' roomId={id}/>
                <FunctionCard title='Sonstiges' id='Sonstiges' roomId={id}/>
                <FunctionCard title='Fenster' id='Fenster' roomId={id}/>
                {/*</div>*/}
            </div>
        </>
    );
}