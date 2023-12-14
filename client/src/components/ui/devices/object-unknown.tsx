import { UiStateObject } from '@/domain/logics';
import { DynamicIcon } from '@/components/ui/icons/DynamicIcon';
import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';

export type ObjectUnknownProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: UiStateObject;
};

export function ObjectUnknown({ uiStateObject, sectionId, cardId }: ObjectUnknownProps) {
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
            {uiStateObject.isWriteable ? (
                <div className="flex-none">write: {uiStateObject.value}</div>
            ) : (
                <div className="flex-none">read: {uiStateObject.value}</div>
            )}
        </div>
    );
}
