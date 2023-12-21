import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';
import { CSSProperties, ReactNode } from 'react';
import { convertIconKeyToMdiFormat, isValidIconKey } from './dynamic-material-design-icon.tools';

type DynamicIconProps = { iconKey: string; className: string; style?: CSSProperties };

export function DynamicMaterialDesignIcon({ iconKey, className, style }: DynamicIconProps): ReactNode | undefined {
    const sanitizedIconKey = !iconKey.startsWith('mdi') ? convertIconKeyToMdiFormat(iconKey.toLowerCase()) : iconKey;
    if (!isValidIconKey(sanitizedIconKey)) {
        return undefined;
    }

    const iconPath = mdiIcons[sanitizedIconKey];

    return <Icon className={className} path={iconPath} title={sanitizedIconKey} style={style} />;
}
