import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';
import { ReactNode } from 'react';
import { convertIconKeyToMdiFormat, isValidIconKey } from './dynamic-icon-tools';

type DynamicIconProps = { iconKey: string; className: string };

export function DynamicIcon({ iconKey, className }: DynamicIconProps): ReactNode | undefined {
    const sanitizedIconKey = !iconKey.startsWith('mdi') ? convertIconKeyToMdiFormat(iconKey.toLowerCase()) : iconKey;
    if (!isValidIconKey(sanitizedIconKey)) {
        return undefined;
    }

    const iconPath = mdiIcons[sanitizedIconKey];

    return <Icon className={className} path={iconPath} title={sanitizedIconKey} />;
}
