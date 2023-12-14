import { CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/icons/dynamic-icon';

export type ObjectEnumProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectSelect({ uiStateObject, sectionId, cardId }: ObjectEnumProps) {
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
            <div className="flex-grow truncate pl-2 pr-[1px]">
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
                    {uiStateObject.isWriteable ? (
                        <Select defaultValue={'' + uiStateObject.value}>
                            <SelectTrigger className="my-2 w-full">
                                <SelectValue placeholder="No value" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {uiStateObject.states &&
                                        Object.entries(uiStateObject.states).map((entry) => {
                                            return <SelectItem value={entry[0]}>{entry[1]}</SelectItem>;
                                        })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ) : (
                        ''
                    )}
                </Label>
            </div>
            {!uiStateObject.isWriteable ? (
                <div className={'flex-none'}>
                    <span>{uiStateObject.states && uiStateObject.states['' + uiStateObject.value]}</span>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
