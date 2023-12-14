import { UiStateObject } from '@/domain/logics';
import { DynamicIcon } from '@/components/ui/icons/DynamicIcon';
import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export type ObjectSwitchProps = {
    sectionId: string;
    cardId: string;
    stateObject: UiStateObject;
};

export function ObjectSwitch({ stateObject, sectionId, cardId }: ObjectSwitchProps) {
    return (
        <div className="flex items-center w-full" key={`div_${sectionId}_${cardId}_${stateObject.id}`}>
            <div className="flex-none flex items-center ">
                {stateObject.customIcon ? (
                    <DynamicIcon
                        className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                        iconKey={stateObject.customIcon}
                    />
                ) : undefined}
            </div>
            <div className="flex-grow truncate mx-2">
                <Label htmlFor={`${sectionId}_${cardId}_${stateObject.id}`}>
                    <CardTitle>
                        <span className="whitespace-nowrap overflow-hidden">
                            {stateObject.displayName ? stateObject.displayName : stateObject.name}
                        </span>
                    </CardTitle>
                    {stateObject.description ? (
                        <CardDescription>
                            <span className="whitespace-nowrap overflow-hidden">{stateObject.description}</span>
                        </CardDescription>
                    ) : (
                        ''
                    )}
                </Label>
            </div>
            <div className="flex-none">
                <Switch id={`${sectionId}_${cardId}_${stateObject.id}`} checked={stateObject.value === true} />
            </div>
        </div>
    );
}
