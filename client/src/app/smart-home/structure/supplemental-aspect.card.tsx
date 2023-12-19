import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/__generated__/components/card';
import { Label } from '@/__generated__/components/label';
import { Switch } from '@/__generated__/components/switch';
import { Separator } from '@/__generated__/components/separator';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { mapToStateObjectComponent } from '@/app/smart-home/state-objects/map-state-object';
import { StateObject } from '@/app/smart-home/structure/aspect';

type SupplementalAspectCardProps = {
    id: string;
    sectionId: string;
    title: string;
    functionObjectIds: string[];
};

export function SupplementalAspectCard({ id, title, sectionId, functionObjectIds }: SupplementalAspectCardProps) {
    const { stateObjects, stateValues } = useVuiDataContext();

    const [vuiStateObjects, setVuiStateObjects] = useState<StateObject[]>([]);

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
                    value: stateValue?.value || null,
                    lastChange: stateValue?.lastChange || null,
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
                        </div>
                        <div className="hidden items-center">
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
                        return mapToStateObjectComponent(sectionId, id, object);
                    })}
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        );
    }

    return undefined;
}
