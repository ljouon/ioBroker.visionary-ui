import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/icons/dynamic-icon';

export type StateObjectValueOnlyProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectValueOnly({ uiStateObject, sectionId, cardId }: StateObjectValueOnlyProps) {
    let displayElement = undefined;
    if ('boolean' === uiStateObject.datatype) {
        displayElement =
            uiStateObject.value === true ? (
                <DynamicIcon iconKey="check-circle-outline" className="w-6 h-6" />
            ) : (
                <DynamicIcon iconKey="close-circle-outline" className="w-6 h-6" />
            );
    } else {
        displayElement = uiStateObject.value + (uiStateObject.unit ? ' ' + uiStateObject.unit : '');
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
                <Label htmlFor={`${sectionId}_${cardId}_${uiStateObject.id}`}>
                    <CardTitle>
                        <span className="whitespace-nowrap overflow-hidden">
                            {uiStateObject.displayName ? uiStateObject.displayName : uiStateObject.name}
                        </span>
                    </CardTitle>
                    {uiStateObject.description ? (
                        <CardDescription>
                            <span className="whitespace-nowrap overflow-hidden">{uiStateObject.description}</span>
                        </CardDescription>
                    ) : (
                        ''
                    )}
                </Label>
            </div>
            <div className="flex-none">{displayElement}</div>
        </div>
    );
}
