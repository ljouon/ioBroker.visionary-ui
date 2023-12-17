import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { useVuiDataContext } from '@/vui-data.context';
import { useEffect, useState } from 'react';

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
