import {useParams} from 'react-router-dom';
import {AspectNode, findAspectNode} from '@/app/smart-home/structure/aspect';
import {useVuiDataContext} from '@/app/smart-home/data.context';
import {MainAspectSection} from '@/app/smart-home/structure/main-aspect.section';
import {hasStateObjects, isRoom, VuiEnum} from '../../../../../src/domain';
import {matchPath} from '@/app/route-utils';
import {useEffect, useState} from 'react';
import {ErrorDisplay} from '@/app/components/error';
import {useTranslation} from 'react-i18next';

export function MainAspectPage() {
    const {mainAspect, canonicalPath} = useParams();
    const {roomAspectNodes, functionAspectNodes, connectionState} = useVuiDataContext();
    const [selectedAspectNode, setSelectedAspectNode] = useState<AspectNode | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        if (mainAspect && roomAspectNodes && functionAspectNodes) {
            const nodes = mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes;
            const result =
                nodes.length > 0
                    ? findAspectNode(nodes, (node) => matchPath(canonicalPath || '', node.canonicalPath))
                    : null;
            setSelectedAspectNode(result);
        }
    }, [roomAspectNodes, functionAspectNodes, mainAspect, canonicalPath, connectionState]);

    if (connectionState !== 'OPEN') {
        return (
            <ErrorDisplay
                icon="connection"
                iconInRed={true}
                message={t('no_connection_to_server')}
                showRefreshButton={true}
            />
        );
    }

    if (!selectedAspectNode) {
        return (
            <ErrorDisplay
                icon="alert-circle-outline"
                message={t('element_not_found_navigate_back')}
                linkToHome={true}
            />
        );
    }

    const mainAspects = getMainAspects(selectedAspectNode);
    return mainAspects.map((element, index) => (
        <MainAspectSection
            key={`${index}_${element.id}`}
            id={element.id}
            type={isRoom(element) ? 'rooms' : 'functions'}
        />
    ));
}

function getMainAspects(node: AspectNode): VuiEnum[] {
    if (!node || !node.mainAspect || node.level >= 2) {
        return [];
    }
    const children = node.children
        .filter((child) => child && child.mainAspect && hasStateObjects(child.mainAspect))
        .map((child) => child.mainAspect!);
    return [node.mainAspect, ...children];
}
