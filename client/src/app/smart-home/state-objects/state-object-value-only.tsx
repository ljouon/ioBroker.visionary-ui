import {CardDescription, CardTitle} from '@/__generated__/components/card';
import {DynamicIcon} from '@/app/components/dynamic-icon';
import {StateObject} from '@/app/smart-home/structure/aspect';

export type StateObjectValueOnlyProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectValueOnly({uiStateObject, sectionId, cardId}: StateObjectValueOnlyProps) {
    let displayElement;
    if ('boolean' === uiStateObject.datatype) {
        displayElement =
            uiStateObject.value === true ? (
                <DynamicIcon iconKey="check-circle-outline" className="w-6 h-6 text-green-600"/>
            ) : (
                <DynamicIcon iconKey="close-circle-outline" className="w-6 h-6 text-red-600"/>
            );
    } else if ('number' === uiStateObject.datatype && uiStateObject.states && uiStateObject.value !== null) {
        const stateLabel = uiStateObject.states[Number(uiStateObject.value)];
        displayElement = `${stateLabel}${uiStateObject.unit ? ` ${uiStateObject.unit}` : ''}`;
    } else {
        displayElement = `${uiStateObject.value}${uiStateObject.unit ? ` ${uiStateObject.unit}` : ''}`;
    }

    return (
        <div className="flex items-center w-full" key={sectionId + '-' + cardId + '-' + uiStateObject.id}>
            <div className="flex-none flex items-center ">
                {uiStateObject.customIcon ? (
                    <DynamicIcon
                        className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                        iconKey={uiStateObject.customIcon}
                    />
                ) : undefined}
            </div>
            <div className="flex-grow truncate mx-2">
                <CardTitle>
                    <span
                        className="ml-0 whitespace-nowrap overflow-hidden text-sm font-semibold leading-none tracking-tight">
                        {uiStateObject.displayName ? uiStateObject.displayName : uiStateObject.name}
                    </span>
                </CardTitle>
                {uiStateObject.description ? (
                    <CardDescription>
                        <span className="whitespace-nowrap overflow-hidden">{uiStateObject.description}</span>
                    </CardDescription>
                ) : undefined}
            </div>
            <div className="flex-none">{displayElement}</div>
        </div>
    );
}
