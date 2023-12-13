import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Separator} from '@/components/ui/separator';
import {useVuiDataContext} from '@/vui-data.context';
import {useEffect, useState} from 'react';
import {VuiStateObject} from '../../../../../src/domain';
import Icon from '@mui/material/Icon';

type FunctionCardProps = {
    id: string;
    roomId: string;
    title: string;
    functionObjectIds: string[];
};

type UiStateObject = VuiStateObject & {
    value: string | number | boolean | null;
    lastChange: number | null;
};

export function FunctionCard({id, title, roomId, functionObjectIds}: FunctionCardProps) {
    const {stateObjects, stateValues} = useVuiDataContext();

    const [vuiStateObjects, setVuiStateObjects] = useState<UiStateObject[]>([]);

    useEffect(() => {
        const vuiObjects = stateObjects
            .filter((object) => functionObjectIds.includes(object.id))
            .sort((objectA, objectB) => {
                const rankA = objectA.rank ?? 0;
                const rankB = objectB.rank ?? 0;
                return rankA > rankB ? 1 : -1;
            })
            .map((object) => {
                console.log(object.name);
                const stateValue = stateValues.find((stateValue) => stateValue.id === object.id);

                const result = {
                    ...object,
                    value: stateValue ? stateValue.value : object.defaultValue,
                    lastChange: stateValue ? stateValue.lastChange : null,
                };
                console.log(result);
                return result;
            });
        setVuiStateObjects(vuiObjects);
    }, [functionObjectIds, stateObjects, stateValues]);

    return (
        <Card className="overflow-y-auto">
            <CardHeader>
                <div className="flex items-center justify-between space-x-2">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>Beschreibung</CardDescription>
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor={`${roomId}_all_${id}`} className="mr-2">
                            <span className="font-bold leading-snug text-muted-foreground">Alle</span>
                        </Label>
                        <Switch id={`${roomId}_all_${id}`} defaultChecked/>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Separator/>
                {vuiStateObjects.map((object) => (
                    <div className="flex items-center w-full" key={`div_${roomId}_${id}_${object.id}`}>
                        <div className="flex-none flex items-center ">
                            {object.customIcon ? (
                                    <Icon className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50">
                                        {object.customIcon}
                                    </Icon>
                                ) :
                                undefined}
                        </div>
                        <div className="flex-grow truncate mx-2">
                            <Label htmlFor={`${roomId}_${id}_${object.id}`}>
                                <CardTitle>
                                    <span className="whitespace-nowrap overflow-hidden">
                                        {object.displayName ? object.displayName : object.name}
                                    </span>
                                </CardTitle>
                                {object.description ? (
                                    <CardDescription>
                                        <span className="whitespace-nowrap overflow-hidden">{object.description}</span>
                                    </CardDescription>
                                ) : (
                                    ''
                                )}
                            </Label>
                        </div>
                        <div className="flex-none">
                            <Switch id={`${roomId}_${id}_${object.id}`} checked={object.value === true}/>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}
