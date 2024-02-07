import {useNavigate} from 'react-router-dom';
import {useVuiDataContext} from '@/app/smart-home/data.context';
import {createAspectPath} from '@/app/route-utils';
import {useEffect} from 'react';
import {ErrorDisplay} from '@/app/components/error';
import {useTranslation} from 'react-i18next';

export function HomePage() {
    const {roomAspectNodes} = useVuiDataContext();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {connectionState} = useVuiDataContext();

    useEffect(() => {
        if (connectionState === 'OPEN') {
            const selectedAspectNode = roomAspectNodes[0];
            if (selectedAspectNode) {
                navigate(createAspectPath('rooms', selectedAspectNode.canonicalPath));
            }
        }
    }, [connectionState, navigate, roomAspectNodes]);

    return <ErrorDisplay icon="connection" iconInRed={true} message={t('no_connection_to_server')}/>;
}
