import { UiStateObject } from '@/domain/logics';
import { DynamicIcon } from '@/components/ui/icons/DynamicIcon';
import { Slider } from '@/components/ui/slider';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export type ObjectSliderProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: UiStateObject;
};

export function ObjectSlider({ uiStateObject, sectionId, cardId }: ObjectSliderProps) {
    return (
        <div className="flex items-center w-full" key={`div_${sectionId}_${cardId}_${uiStateObject.id}`}>
            <div className="flex-none flex items-center ">
                {uiStateObject.customIcon ? (
                    <DynamicIcon
                        className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                        iconKey={uiStateObject.customIcon}
                    />
                ) : undefined}
            </div>
            <div className="flex-grow truncate pl-2">
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
                    <Slider
                        hideThumb={!uiStateObject.isWriteable}
                        className={'my-2'}
                        id={`${sectionId}_${cardId}_${uiStateObject.id}`}
                        min={uiStateObject.minValue || undefined}
                        max={uiStateObject.maxValue || undefined}
                        defaultValue={uiStateObject.value ? [Number(uiStateObject.value)] : []}
                        //value={uiStateObject.value ? [Number(uiStateObject.value)] : []}
                    />
                </Label>
            </div>
        </div>
    );
}
