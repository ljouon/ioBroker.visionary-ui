import {DynamicMaterialDesignIcon} from '@/app/components/dynamic-material-design-icon';
import {VuiEnum} from '../../../../src/domain';
import {useContext} from 'react';
import {ThemeContext} from '@/app/theme/theme-provider';

export type VuiEnumIconProps = {
    size?: number;
    element: VuiEnum | null;
};

export function VuiEnumIcon({element, size = 10}: VuiEnumIconProps) {
    const {theme} = useContext(ThemeContext);

    // Material Design Icon
    if (element?.customIcon) {
        // If color is set on VuiEnum use it for light theme. In case of the dark theme always use opacity 60
        const lightThemeOpacity = !element.color ? `opacity-60` : '';
        return (
            <DynamicMaterialDesignIcon
                iconKey={element?.customIcon}
                className={`${lightThemeOpacity} dark:opacity-60 h-${size} w-${size}`}
                style={theme === 'light' ? {color: `${element.color}`} : {}}
            />
        );
    } else if (element?.icon) {
        // ioBroker Icon
        return <img className={`opacity-60 dark:invert p-1 h-${size} w-${size}`} src={element.icon} alt={'icon'}/>;
    }
    // No icon
    return <div className={`h-${size} w-${size}`}/>;
}
