import { useContext } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/__generated__/components/card';
import { Label } from '@/__generated__/components/label';
import { Switch } from '@/__generated__/components/switch';
import { Separator } from '@/__generated__/components/separator';
import { mapToStateObjectComponent } from '@/app/smart-home/state-objects/map-state-object';
import { VuiEnumIcon } from '@/app/components/vui-enum-icon';
import { VuiEnum } from '../../../../../src/domain';
import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';
import { ThemeContext } from '@/app/theme/theme-provider';
import { useTranslation } from 'react-i18next';
import { useStateObjects } from '@/app/smart-home/state-objects/state-object';

type SupplementalAspectCardProps = {
    element: VuiEnum;
    parentId: string;
    onAspectCardTitleClicked: (aspectId: string) => void;
};

export function SupplementalAspectCard({ element, parentId, onAspectCardTitleClicked }: SupplementalAspectCardProps) {
    const { vuiStateObjects } = useStateObjects(element.members || []);
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();

    if (vuiStateObjects.length > 0) {
        return (
            <Card className="overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center justify-between space-x-2">
                            <VuiEnumIcon element={element} />
                            <CardTitle>{element.name}</CardTitle>
                        </div>
                        <div onClick={() => onAspectCardTitleClicked(element.id)}>
                            <DynamicMaterialDesignIcon
                                iconKey="arrow-top-right-thin-circle-outline"
                                className="w-6 h-6 opacity-50 m-2 cursor-pointer"
                            />
                        </div>
                        <div className="hidden items-center">
                            <Label htmlFor={`${parentId}_all_${element.id}`} className="mr-2">
                                <span className="font-bold leading-snug text-muted-foreground">{t('all')}</span>
                            </Label>
                            <Switch id={`${parentId}_all_${element.id}`} defaultChecked />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator
                        className="h-1"
                        style={theme !== 'dark' ? { backgroundColor: element.color || '' } : {}}
                    />
                    {vuiStateObjects.map((object) => {
                        return mapToStateObjectComponent(parentId, element.id, object);
                    })}
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        );
    }

    return undefined;
}
