import { CardDescription, CardTitle } from '@/__generated__/components/card';
import { Popover, PopoverContent } from '@/__generated__/components/popover';
import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';
import { StateObject } from '@/app/smart-home/state-objects/state-object';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { HsvaColor, hsvaToHex, hsvaToRgba, rgbStringToHsva } from '@uiw/color-convert';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { Button } from '@/__generated__/components/button';
import { useTranslation } from 'react-i18next';

export type StateObjectRgbLightProps = {
    sectionId: string;
    cardId: string;
    redState: StateObject;
    greenState: StateObject;
    blueState: StateObject;
    rgbString: string;
};

function rgbToHexColor(rgbString: string) {
    return hsvaToHex({ ...rgbStringToHsva(rgbString), a: 1 });
}

function hsvaToHexColor(hsva: HsvaColor) {
    return hsvaToHex({ ...hsva, a: 1 });
}

function hsvaToRgbColor(hsva: HsvaColor) {
    return hsvaToRgba({ ...hsva, a: 1 });
}

function rgbStringToHsvaColor(rgbString: string) {
    return { ...rgbStringToHsva(rgbString), a: 1 };
}

export function StateObjectRgbLight({
    redState,
    greenState,
    blueState,
    rgbString,
    sectionId,
    cardId,
}: StateObjectRgbLightProps) {
    const { sendVuiAction } = useVuiDataContext();
    const { t } = useTranslation();

    const [hsva, setHsva] = useState<HsvaColor>();

    function setValues() {
        if (hsva) {
            const rgb = hsvaToRgbColor(hsva);

            const actions = [];

            if (redState.value !== rgb.r) {
                actions.push({ id: redState.id, value: rgb.r });
            }

            if (greenState.value !== rgb.g) {
                actions.push({ id: greenState.id, value: rgb.g });
            }

            if (blueState.value !== rgb.b) {
                actions.push({ id: blueState.id, value: rgb.b });
            }

            if (actions.length > 0) {
                sendVuiAction({
                    type: 'setValues',
                    data: actions,
                });
            }
        }
    }

    useEffect(() => {
        setHsva(rgbStringToHsvaColor(rgbString));
    }, [rgbString]);

    return (
        hsva && (
            <div className="flex items-center w-full" key={sectionId + '-' + cardId + '-' + redState.id}>
                <div className="flex-none flex items-center ">
                    {redState?.customIcon ? (
                        <DynamicMaterialDesignIcon
                            className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                            iconKey={redState.customIcon}
                        />
                    ) : undefined}
                </div>
                <div className="flex-grow truncate mx-2">
                    <CardTitle>
                        <span className="ml-0 whitespace-nowrap overflow-hidden text-sm font-semibold leading-none tracking-tight">
                            {redState?.displayName ? redState.displayName : redState?.name}
                        </span>
                    </CardTitle>
                    {redState?.description ? (
                        <CardDescription>
                            <span className="whitespace-nowrap overflow-hidden">{redState.description}</span>
                        </CardDescription>
                    ) : undefined}
                </div>
                <div className="flex-none">
                    <Popover>
                        <PopoverTrigger>
                            <div
                                style={{ background: rgbToHexColor(rgbString) }}
                                className="w-8 h-8 rounded-full border-blue-600 border-2"
                            ></div>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 h-50">
                            <div>
                                <Wheel color={hsva} onChange={(color) => setHsva({ ...hsva, ...color.hsva, a: 1 })} />
                                <div
                                    style={{ background: hsvaToHexColor(hsva) }}
                                    className="w-full h-8 rounded border-blue-600 border-2 mt-4"
                                ></div>
                                <Button variant="outline" className="w-full mt-4" onClick={() => setValues()}>
                                    {t('accept')}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        )
    );
}
