import { getPathSegments } from '@/app/smart-home/structure/aspect';
import { VuiStateObject, VuiStateValue } from '../../../../../src/domain';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { useEffect, useState } from 'react';

const colorRoles = ['level.color.red', 'level.color.blue', 'level.color.green'];

export type StateObjectWrapper = {
    id: string;
    role: string;
    stateObjects: StateObject[];
};

export type StateObject = VuiStateObject & {
    value: string | number | boolean | null;
    lastChange: number | null;
};

export function useStateObjects(members: string[]) {
    const { stateObjects, stateValues } = useVuiDataContext();
    const [vuiStateObjects, setVuiStateObjects] = useState<StateObjectWrapper[]>([]);

    useEffect(() => {
        const reorganizedStateObjects = organizeStateObjects(members, stateObjects, stateValues);
        setVuiStateObjects(reorganizedStateObjects);
    }, [members, stateObjects, stateValues]);

    return {
        vuiStateObjects,
    };
}

export function organizeStateObjects(
    members: string[],
    stateObjects: VuiStateObject[],
    stateValues: VuiStateValue[],
): StateObjectWrapper[] {
    const vuiObjects = stateObjects
        .filter((object) => object.enabled)
        .filter((object) => members.some((memberId) => object.id.startsWith(memberId)))
        .sort((objectA, objectB) => {
            const rankA = objectA.rank ?? 0;
            const rankB = objectB.rank ?? 0;
            return rankA > rankB ? 1 : -1;
        })
        .map((object: VuiStateObject) => {
            const stateValue = stateValues.find((stateValue) => stateValue.id === object.id) || null;
            return {
                ...object,
                value: stateValue && stateValue.value !== null ? stateValue.value : null,
                lastChange: stateValue?.lastChange || null,
            };
        });

    return groupIfApplicable(vuiObjects);
}

export function groupIfApplicable(vuiObjects: StateObject[]): StateObjectWrapper[] {
    const rgbObjects = new Map<string, StateObjectWrapper>();

    vuiObjects.forEach((object) => {
        if (colorRoles.includes(object.role)) {
            // Find elements for RGB group
            const objectGroupId: string = getObjectGroupId(object.id);
            const wrapper: StateObjectWrapper = getOrCreateStateObjectWrapper(rgbObjects, objectGroupId, 'light.color');

            wrapper.stateObjects.push({
                ...object,
            });
            // Group by prefix of object id
            rgbObjects.set(objectGroupId, wrapper);
        } else {
            // Default: only one object in a wrapper
            rgbObjects.set(object.id, { id: object.id, role: object.role, stateObjects: [object] });
        }
    });
    return [...rgbObjects.values()];
}

function getObjectGroupId(objectId: string): string {
    const pathSegments = getPathSegments(objectId, '');
    pathSegments.pop();
    return pathSegments.join('.');
}

function getOrCreateStateObjectWrapper(
    stateObjectMap: Map<string, StateObjectWrapper>,
    objectGroupId: string,
    role: string,
): StateObjectWrapper {
    const stateObjectWrapper = stateObjectMap.get(objectGroupId);
    if (!stateObjectWrapper) {
        return { id: objectGroupId, role, stateObjects: [] };
    } else {
        return stateObjectWrapper;
    }
}
