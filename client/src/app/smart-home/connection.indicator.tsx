import {DynamicMaterialDesignIcon} from '@/app/components/dynamic-material-design-icon';
import {useVuiDataContext} from '@/app/smart-home/data.context';

export function ConnectionIndicator() {
    const {connectionState} = useVuiDataContext();
    return connectionState !== 'OPEN' ? (
        <DynamicMaterialDesignIcon iconKey="connection" className={'w-6 h-6 text-red-500'}/>
    ) : undefined;
}
