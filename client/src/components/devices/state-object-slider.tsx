import { Slider } from '@/components/ui/slider';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/icons/dynamic-icon';

export type StateObjectSliderProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectSlider({ uiStateObject, sectionId, cardId }: StateObjectSliderProps) {
    let valueString = '';
    console.log(uiStateObject.value);
    if (uiStateObject.unit) {
        valueString = uiStateObject.value + ' ' + uiStateObject.unit;
    } else if (
        (Number(uiStateObject.value) || uiStateObject.value === 0) &&
        uiStateObject.maxValue &&
        uiStateObject.maxValue > 0
    ) {
        valueString = Math.round((Number(uiStateObject.value) / uiStateObject.maxValue) * 100) + ' %';
    }

    return (
        <div className="flex-row w-full">
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
                            'blblblbllb'
                        )}
                    </Label>
                </div>
                {valueString}
            </div>
            <Slider
                hideThumb={!uiStateObject.isWriteable}
                className={'my-4'}
                id={`${sectionId}_${cardId}_${uiStateObject.id}`}
                min={uiStateObject.minValue || undefined}
                max={uiStateObject.maxValue || undefined}
                defaultValue={uiStateObject.value ? [Number(uiStateObject.value)] : []}
            />
        </div>
    );
}
