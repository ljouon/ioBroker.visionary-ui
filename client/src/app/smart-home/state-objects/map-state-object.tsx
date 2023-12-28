import { StateObjectValueOnly } from '@/app/smart-home/state-objects/state-object-value-only';
import { StateObjectSwitch } from '@/app/smart-home/state-objects/state-object-switch';
import { StateObjectButton } from '@/app/smart-home/state-objects/state-object-button';
import { StateObjectSlider } from '@/app/smart-home/state-objects/state-object-slider';
import { StateObjectSelect } from '@/app/smart-home/state-objects/state-object-select';
import { StateObject, StateObjectWrapper } from '@/app/smart-home/state-objects/state-object';
import { StateObjectRgbLight } from '@/app/smart-home/state-objects/state-object-rgb-light';

function shouldBeValueOnly(uiStateObject: StateObject): boolean {
    return !uiStateObject.isWriteable;
}

function shouldBeSwitch(uiStateObject: StateObject): boolean {
    return 'boolean' === uiStateObject.datatype && uiStateObject.role !== 'button';
}

function shouldBeButton(uiStateObject: StateObject): boolean {
    return 'boolean' === uiStateObject.datatype && uiStateObject.role === 'button';
}

function shouldBeSlider(uiStateObject: StateObject): boolean {
    if (
        'number' === uiStateObject.datatype &&
        uiStateObject.minValue !== null &&
        uiStateObject.maxValue !== null &&
        uiStateObject.role.includes('level')
    ) {
        if (!uiStateObject.states) {
            return true;
        }
    }
    return false;
}

function shouldBeSelect(uiStateObject: StateObject) {
    if ('number' === uiStateObject.datatype) {
        if (uiStateObject.states || (uiStateObject.minValue !== null && uiStateObject.maxValue !== null)) {
            return true;
        }
    }
    return false;
}

function createStateObjectRGBLight(stateObjectWrapper: StateObjectWrapper, sectionId: string, cardId: string) {
    const redState = stateObjectWrapper.stateObjects.find((stateObject) => stateObject.role === 'level.color.red');
    const greenState = stateObjectWrapper.stateObjects.find((stateObject) => stateObject.role === 'level.color.green');
    const blueState = stateObjectWrapper.stateObjects.find((stateObject) => stateObject.role === 'level.color.blue');

    const rgbString = `rgb(${redState?.value}, ${greenState?.value}, ${blueState?.value})`;

    if (redState && greenState && blueState) {
        return (
            <StateObjectRgbLight
                key={sectionId + '-' + cardId + '-' + stateObjectWrapper.id}
                sectionId={sectionId}
                cardId={cardId}
                redState={redState}
                greenState={greenState}
                blueState={blueState}
                rgbString={rgbString}
            />
        );
    }
    return undefined;
}

export function mapToStateObjectComponent(sectionId: string, cardId: string, stateObjectWrapper: StateObjectWrapper) {
    if (stateObjectWrapper.stateObjects.length == 1) {
        const uiStateObject = stateObjectWrapper.stateObjects[0];

        if (shouldBeValueOnly(uiStateObject)) {
            return (
                <StateObjectValueOnly
                    key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                    uiStateObject={uiStateObject}
                    sectionId={sectionId}
                    cardId={cardId}
                />
            );
        }
        if (shouldBeSwitch(uiStateObject)) {
            return (
                <StateObjectSwitch
                    key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                    uiStateObject={uiStateObject}
                    sectionId={sectionId}
                    cardId={cardId}
                />
            );
        }
        if (shouldBeButton(uiStateObject)) {
            return (
                <div key={sectionId + '-' + cardId + '-' + uiStateObject.id}>
                    <StateObjectButton
                        key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                        uiStateObject={uiStateObject}
                        sectionId={sectionId}
                        cardId={cardId}
                    />
                </div>
            );
        }
        if (shouldBeSlider(uiStateObject)) {
            return (
                <StateObjectSlider
                    key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                    uiStateObject={uiStateObject}
                    sectionId={sectionId}
                    cardId={cardId}
                />
            );
        }
        if (shouldBeSelect(uiStateObject)) {
            return (
                <StateObjectSelect
                    key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                    uiStateObject={uiStateObject}
                    sectionId={sectionId}
                    cardId={cardId}
                />
            );
        }
        return (
            <StateObjectValueOnly
                key={sectionId + '-' + cardId + '-' + uiStateObject.id}
                uiStateObject={uiStateObject}
                sectionId={sectionId}
                cardId={cardId}
            />
        );
    } else if (stateObjectWrapper.stateObjects.length > 0) {
        if (stateObjectWrapper.role === 'light.color') {
            return createStateObjectRGBLight(stateObjectWrapper, sectionId, cardId);
        }
    }
    return undefined;
}
