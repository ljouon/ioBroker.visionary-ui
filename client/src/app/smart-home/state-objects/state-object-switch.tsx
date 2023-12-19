import { DynamicIcon } from '@/app/dynamic-icon';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { useEffect, useState } from 'react';
import { Label } from '@/__generated__/components/label';
import { CardDescription, CardTitle } from '@/__generated__/components/card';
import { Switch } from '@/__generated__/components/switch';
import { StateObject } from '@/app/smart-home/structure/aspect';

export type StateObjectSwitchProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectSwitch({ uiStateObject, sectionId, cardId }: StateObjectSwitchProps) {
    const defaultChecked = uiStateObject.value === true;
    const [internalValue, setInternalValue] = useState(defaultChecked);
    const { sendVuiAction } = useVuiDataContext();

    const handleValueChange = (newValue: boolean) => {
        setInternalValue(newValue);
        sendVuiAction({ type: 'setValues', data: [{ id: uiStateObject.id, value: newValue }] });
    };

    useEffect(() => {
        setInternalValue(defaultChecked);
    }, [defaultChecked]);

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
            <div className="flex-grow truncate pl-2 mr-2">
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
            <div className="flex-none">
                <Switch
                    id={`${sectionId}_${cardId}_${uiStateObject.id}`}
                    defaultChecked={defaultChecked}
                    checked={internalValue}
                    onCheckedChange={handleValueChange}
                />
            </div>
        </div>
    );
}
