import {DynamicMaterialDesignIcon} from '@/app/components/dynamic-material-design-icon';
import {VuiEnum} from '../../../../src/domain';

export type VuiEnumIconProps = {
    size?: number;
    element: VuiEnum | null;
};

export function VuiEnumIcon({element, size = 10}: VuiEnumIconProps) {
    // Material Design Icon
    if (element?.customIcon) {
        return (
            <DynamicMaterialDesignIcon
                iconKey={element?.customIcon}
                className={`opacity-60 dark:opacity-60 h-${size} w-${size}`}
            />
        );
    } else if (element?.icon) {
        // ioBroker Icon
        return <img className={`opacity-60 dark:invert p-1 h-${size} w-${size}`} src={element.icon} alt={'icon'}/>;
    }
    // No icon
    return <div className={`h-${size} w-${size}`}/>;
}
