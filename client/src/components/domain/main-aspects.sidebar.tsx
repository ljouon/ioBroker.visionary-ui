import { cn } from '@/lib/utils';
import { AspectNode, hasChildren } from '@/domain/aspect';
import { hasStateObjects, VuiEnum } from '../../../../src/domain';
import { Button } from '@/__generated__/components/button';

interface MainAspectsSidebarProps<T extends VuiEnum, S extends VuiEnum> extends React.HTMLAttributes<HTMLDivElement> {
    aspectNodes: AspectNode<T, S>[];
    onAspectNodeClicked: (treeNode: AspectNode<T, S>) => void;
}

export function MainAspectsSidebar<T extends VuiEnum, S extends VuiEnum>({
    className,
    aspectNodes,
    onAspectNodeClicked,
}: MainAspectsSidebarProps<T, S>) {
    return (
        <div className={cn('pb-12', className)}>
            <div className="space-y-2 py-2">
                {aspectNodes?.map((node) => {
                    if (hasChildren(node) || hasStateObjects(node.mainAspect)) {
                        return (
                            <div key={node.canonicalPath} className="py-1">
                                <h2
                                    className="flex w-full items-baseline px-2 text-lg font-semibold tracking-tight cursor-pointer"
                                    onClick={() => onAspectNodeClicked(node)}
                                >
                                    <span className="uppercase font-bold text-sm opacity-40 flex-grow truncate">
                                        {node.mainAspect?.name}
                                    </span>
                                    <div className={'w-6 h-6 flex-none'}>
                                        {node.mainAspect?.icon ? (
                                            <img
                                                className="dark:invert opacity-50"
                                                src={node.mainAspect?.icon ?? undefined}
                                                alt={'icon'}
                                            />
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                </h2>
                                {/*<Separator/>*/}
                                <div className="pt-2 relative overflow-hidden h-full w-full rounded-[inherit]">
                                    <div className="space-y-1">
                                        {node.children?.map((child, i) => {
                                            if (hasStateObjects(child.mainAspect)) {
                                                return (
                                                    <Button
                                                        key={`${child}-${i}`}
                                                        variant="ghost"
                                                        className="flex font-normal px-2 w-full"
                                                        onClick={() => onAspectNodeClicked(child)}
                                                    >
                                                        <div className={'w-8 h-8 mr-2 flex-none'}>
                                                            {child.mainAspect?.icon ? (
                                                                <img
                                                                    className="dark:invert opacity-50"
                                                                    src={child.mainAspect?.icon ?? undefined}
                                                                    alt={'icon'}
                                                                />
                                                            ) : (
                                                                <div />
                                                            )}
                                                        </div>
                                                        <span className="flex-grow mx-2 text-left">
                                                            {child.mainAspect?.name}
                                                        </span>
                                                    </Button>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
