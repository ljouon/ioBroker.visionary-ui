import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Separator} from '@/components/ui/separator';
import {useVuiDataContext} from '@/vui-data.context';
import {useEffect, useState} from 'react';
import {UiStateObject} from '@/domain/logics';
import {ObjectSwitch} from '@/components/ui/devices/object-switch';

type FunctionCardProps = {
    id: string;
    parentId: string;
    title: string;
    functionObjectIds: string[];
};

export function FunctionCard({id, title, parentId, functionObjectIds}: FunctionCardProps) {
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
                    value: stateValue ? stateValue.value : null,
                    lastChange: stateValue ? stateValue.lastChange : null,
                };
                console.log(result);
                return result;
            })
            .filter((object) => object.value !== null);
        setVuiStateObjects(vuiObjects);
    }, [functionObjectIds, stateObjects, stateValues]);

    if (vuiStateObjects.length > 0) {
        return (
            <Card className="overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between space-x-2">
                        <div>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>Beschreibung</CardDescription>
                        </div>
                        <div className="flex items-center">
                            <Label htmlFor={`${parentId}_all_${id}`} className="mr-2">
                                <span className="font-bold leading-snug text-muted-foreground">Alle</span>
                            </Label>
                            <Switch id={`${parentId}_all_${id}`} defaultChecked/>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator/>
                    {vuiStateObjects.map((object) => (
                        <ObjectSwitch key={object.id} stateObject={object} pageId={id} cardId={id}/>
                    ))}
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        );
    }

    return undefined;
}
