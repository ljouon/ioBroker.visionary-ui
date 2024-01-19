import { useParams } from 'react-router-dom';
import { AspectNode, findAspectNode } from '@/app/smart-home/structure/aspect';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { MainAspectSection } from '@/app/smart-home/structure/main-aspect.section';
import { hasStateObjects, isRoom, VuiEnum } from '../../../../../src/domain';
import { matchPath } from '@/app/route-utils';
import { useEffect, useState } from 'react';
import { ErrorDisplay } from '@/app/components/error';
import { useTranslation } from 'react-i18next';
import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';

export function MainAspectPage() {
    const { mainAspect, canonicalPath } = useParams();
    const { roomAspectNodes, functionAspectNodes, connectionState } = useVuiDataContext();

    const [selectedAspectNode, setSelectedAspectNode] = useState<AspectNode | null>(null);
    const [topButtonVisible, setTopButtonVisible] = useState<boolean>(false);

    const { t } = useTranslation();

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

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setTopButtonVisible(true);
        } else {
            setTopButtonVisible(false);
        }
    });

    const mainAspects = getMainAspects(selectedAspectNode);
    return (
        <>
            {mainAspects.map((element, index) => (
                <MainAspectSection
                    key={`${index}_${element.id}`}
                    id={element.id}
                    type={isRoom(element) ? 'rooms' : 'functions'}
                />
            ))}
            <div
                className={`${
                    topButtonVisible ? '' : 'hidden'
                } !fixed right-0 bottom-8 rounded-l-full bg-gray-400 hover:bg-primary cursor-pointer inline-flex items-center justify-center`}
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <DynamicMaterialDesignIcon iconKey="arrow-up-circle" className={`h-10 w-10 text-primary-foreground`} />
            </div>
        </>
    );
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
