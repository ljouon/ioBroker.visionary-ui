import { useCallback, useState } from 'react';
import { AspectKey, AspectNode, hasChildren, sortAspectNodesByRank } from '@/app/smart-home/structure/aspect';
import { useNavigate, useParams } from 'react-router-dom';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { Button } from '@/__generated__/components/button';
import { hasStateObjects } from '../../../../../src/domain';
import { ToggleSwitch } from '@/app/components/toggle-switch';
import { createAspectPath } from '@/app/route-utils';
import { DynamicIcon } from '@/app/components/dynamic-icon';

export function MainAspectSidebar({ closeSheet }: { closeSheet: () => void }) {
    const { mainAspect: defaultAspectKey } = useParams();
    const initialState = defaultAspectKey === 'functions' ? 'functions' : 'rooms';
    const [aspectKey, setAspectKey] = useState<AspectKey>(initialState);
    const navigate = useNavigate();
    const { roomAspectNodes, functionAspectNodes } = useVuiDataContext();

    const aspectNodes = aspectKey === 'rooms' ? roomAspectNodes : functionAspectNodes;

    const onAspectClicked = useCallback(
        (canonicalPath: string) => {
            navigate(createAspectPath(aspectKey, canonicalPath));
            closeSheet();
        },
        [aspectKey, navigate, closeSheet],
    );

    function createMainMenuItem(node: AspectNode) {
        if (hasChildren(node) || hasStateObjects(node.mainAspect)) {
            return (
                <div key={node.canonicalPath} className="py-1">
                    <h2
                        className="flex w-full items-baseline px-2 text-lg font-semibold tracking-tight cursor-pointer"
                        onClick={() => onAspectClicked(node.canonicalPath)}
                    >
                        <span className="uppercase font-bold text-sm opacity-40 flex-grow truncate">
                            {node.mainAspect?.name}
                        </span>
                        <div className={'flex-none'}>{createIconImage(node)}</div>
                    </h2>
                    {/*<Separator/>*/}
                    <div className="pt-2 relative overflow-hidden h-full w-full rounded-[inherit]">
                        <div className="space-y-1">
                            {node.children?.sort(sortAspectNodesByRank()).map((child: AspectNode, i) => {
                                return createSubMenuItem(child, i);
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    }

    function createSubMenuItem(child: AspectNode, i: number) {
        if (hasStateObjects(child.mainAspect)) {
            return (
                <Button
                    key={`${child}-${i}`}
                    variant="ghost"
                    className="flex font-normal px-2 w-full"
                    onClick={() => onAspectClicked(child.canonicalPath)}
                >
                    <div className={'mr-2 flex-none'}>{createIconImage(child)}</div>
                    <span className="flex-grow mx-2 text-left">{child.mainAspect?.name}</span>
                </Button>
            );
        }
    }

    function createIconImage(node: AspectNode, size: number = 9) {
        if (node.mainAspect?.customIcon) {
            return (
                <DynamicIcon
                    iconKey={node.mainAspect?.customIcon}
                    className={`dark:invert opacity-50 h-${size} w-${size}`} // TODO: invert and opacity depending on given color!?
                    style={{ color: `${node.mainAspect.color}` }}
                />
            );
        } else if (node.mainAspect?.icon) {
            return (
                <img className={`dark:invert opacity-50 h-${size} w-${size}`} src={node.mainAspect.icon} alt={'icon'} />
            );
        }
        return <div />;
    }

    return (
        <>
            <ToggleSwitch
                initialValue={aspectKey}
                left={{ value: 'rooms', label: 'Räume' }}
                right={{ value: 'functions', label: 'Funktionen' }}
                onSwitch={(value: AspectKey) => {
                    setAspectKey(value);
                }}
            />
            <div className={'pb-12'}>
                <div className="space-y-2 py-2">
                    {aspectNodes?.sort(sortAspectNodesByRank()).map((node) => {
                        return createMainMenuItem(node);
                    })}
                </div>
            </div>
        </>
    );
}
