import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/dynamic-icon';
import { CardDescription, CardTitle } from '@/__generated__/components/card';
import { Button } from '@/__generated__/components/button';
import { Label } from '@/__generated__/components/label';
import { useVuiDataContext } from '@/components/data/vui-data.context';

export type StateObjectButtonProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectButton({ uiStateObject, sectionId, cardId }: StateObjectButtonProps) {
    const { sendVuiAction } = useVuiDataContext();

    const handleValueChange = () => {
        sendVuiAction({ type: 'setValues', data: [{ id: uiStateObject.id, value: true }] });
    };

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
                <Button id={`${sectionId}_${cardId}_${uiStateObject.id}`} onClick={handleValueChange}>
                    <DynamicIcon iconKey="check-bold" className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
