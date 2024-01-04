import { useCallback, useEffect, useState } from 'react';
import { AspectKey, AspectNode, hasChildren, sortAspectNodesByRank } from '@/app/smart-home/structure/aspect';
import { useNavigate, useParams } from 'react-router-dom';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { hasStateObjects } from '../../../../../src/domain';
import { ToggleSwitch } from '@/app/components/toggle-switch';
import { createAspectPath, matchPath } from '@/app/route-utils';
import { VuiEnumIcon } from '@/app/components/vui-enum-icon';
import { useTranslation } from 'react-i18next';

export function MainAspectSidebar({ closeSheet }: { closeSheet: () => void }) {
    const { mainAspect: defaultAspectKey, canonicalPath } = useParams();
    const initialState = defaultAspectKey === 'functions' ? 'functions' : 'rooms';
    const [aspectKey, setAspectKey] = useState<AspectKey>(initialState);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { roomAspectNodes, functionAspectNodes } = useVuiDataContext();

    const aspectNodes = aspectKey === 'rooms' ? roomAspectNodes : functionAspectNodes;

    const onAspectClicked = useCallback(
        (canonicalPath: string) => {
            navigate(createAspectPath(aspectKey, canonicalPath));
            closeSheet();
        },
        [aspectKey, navigate, closeSheet],
    );

    useEffect(() => {}, [canonicalPath]);

    function createMainMenuItem(node: AspectNode) {
        if (hasChildren(node) || hasStateObjects(node.mainAspect)) {
            return (
                <div
                    key={node.canonicalPath}
                    className={`pb-1 pr-1 ${
                        matchPath(canonicalPath || '', node.canonicalPath || '')
                            ? 'border-l-4 border-primary pl-1 rounded-none ml-0'
                            : 'pl-2'
                    }`}
                >
                    <h2
                        className={`flex w-full items-center text-lg font-semibold tracking-tight cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md`}
                        onClick={() => onAspectClicked(node.canonicalPath)}
                    >
                        <span className="uppercase font-bold text-sm opacity-40 flex-grow truncate">
                            {node.mainAspect?.name}
                        </span>
                        <div className={'flex-none'}>
                            <VuiEnumIcon element={node.mainAspect} />
                        </div>
                    </h2>
                    {/*<Separator/>*/}
                    <div className="relative overflow-hidden h-full w-full rounded-[inherit]">
                        <div className="space-y-2">
                            {node.children?.sort(sortAspectNodesByRank()).map((child: AspectNode, i) => {
                                return createSubMenuItem(child, i);
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    }

    function createSubMenuItem(child: AspectNode, keyId: number) {
        if (child.mainAspect && hasStateObjects(child.mainAspect)) {
            return (
                <div
                    key={`${child}-${keyId}`}
                    className={`flex font-normal w-full items-center cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md pr-1 ${
                        matchPath(canonicalPath || '', child.canonicalPath || '')
                            ? 'border-l-4 border-primary pl-1 rounded-none'
                            : 'pl-2'
                    }`}
                    onClick={() => onAspectClicked(child.canonicalPath)}
                >
                    <div className={'flex-none mr-2'}>
                        <VuiEnumIcon element={child.mainAspect} />
                    </div>
                    <span className="flex-grow text-left">{child.mainAspect?.name}</span>
                </div>
            );
        }
    }

    return (
        <>
            <ToggleSwitch
                initialValue={aspectKey}
                left={{ value: 'rooms', label: t('rooms') }}
                right={{ value: 'functions', label: t('functions') }}
                onSwitch={(value: AspectKey) => {
                    setAspectKey(value);
                }}
            />
            <div className={'pb-12'}>
                <div className="space-y-1 py-2">
                    {aspectNodes?.sort(sortAspectNodesByRank()).map((node) => {
                        return createMainMenuItem(node);
                    })}
                </div>
            </div>
        </>
    );
}
