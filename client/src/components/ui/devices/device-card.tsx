import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useVuiDataContext } from '@/vui-data.context';
import { ReactNode, useEffect, useState } from 'react';
import { UiStateObject } from '@/domain/logics';
import { mapToUiObjectComponent } from '@/components/ui/devices/object-mapper';

type DeviceCardProps = {
    id: string;
    sectionId: string;
    title: string;
    functionObjectIds: string[];
};

export function DeviceCard({ id, title, sectionId, functionObjectIds }: DeviceCardProps): ReactNode | undefined {
    const { stateObjects, stateValues } = useVuiDataContext();

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
                const stateValue = stateValues.find((stateValue) => stateValue.id === object.id);

                return {
                    ...object,
                    value: stateValue ? stateValue.value : null,
                    lastChange: stateValue ? stateValue.lastChange : null,
                };
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
                            <Label htmlFor={`${sectionId}_all_${id}`} className="mr-2">
                                <span className="font-bold leading-snug text-muted-foreground">Alle</span>
                            </Label>
                            <Switch id={`${sectionId}_all_${id}`} defaultChecked />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator />
                    {vuiStateObjects.map((object) => {
                        // TODO: map multiple objects to a specific card and let unused objects remain for other cards.
                        return mapToUiObjectComponent(sectionId, id, object);
                    })}
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        );
    }

    return undefined;
}
