import {useNavigate} from 'react-router-dom';
import {useVuiDataContext} from '@/app/smart-home/data.context';
import {createAspectPath} from '@/app/route-utils';
import {DynamicMaterialDesignIcon} from '@/app/components/dynamic-material-design-icon';
import {useEffect} from 'react';

export function HomePage() {
    const {roomAspectNodes} = useVuiDataContext();
    const navigate = useNavigate();

    const {connectionState} = useVuiDataContext();

    useEffect(() => {
        if (connectionState === 'OPEN') {
            const selectedAspectNode = roomAspectNodes[0];
            navigate(createAspectPath('rooms', selectedAspectNode.canonicalPath));
        }
    }, [connectionState, navigate, roomAspectNodes]);

    return (
        <div className="flex flex-col justify-center items-center align-middle w-full h-22">
            <DynamicMaterialDesignIcon
                iconKey="connection"
                className="h-16 w-16 text-red-500 bg-white rounded-sm p-1 mt-4 border border-gray-500"
            />
            <span className={'text-xl text-gray-500 py-2'}>No connection to server</span>
        </div>
    );
}
