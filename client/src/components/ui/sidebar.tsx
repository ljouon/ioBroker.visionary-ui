import {cn} from '@/lib/utils';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {hasStateObjects, VuiEnum} from '../../../../src/domain';
import {hasChildren} from '@/domain/enum';
import {TreeNode} from "@/domain/logics";

interface SidebarProps<T extends VuiEnum, S extends VuiEnum> extends React.HTMLAttributes<HTMLDivElement> {
    treeNodes: TreeNode<T, S>[];
    onTreeNodeClicked: (treeNode: TreeNode<T, S>) => void;
}

export function Sidebar<T extends VuiEnum, S extends VuiEnum>({
                                                                  className,
                                                                  treeNodes,
                                                                  onTreeNodeClicked
                                                              }: SidebarProps<T, S>) {
    return (
        <div className={cn('pb-12', className)}>
            <div className="space-y-4 py-4">
                {treeNodes?.map((node) => {
                    if (hasChildren(node) || hasStateObjects(node.basisData)) {
                        return (
                            <div key={node.canonicalPath} className="py-1">
                                <h2
                                    className="flex items-baseline px-2 text-lg font-semibold tracking-tight cursor-pointer"
                                    onClick={() => onTreeNodeClicked(node)}>
                                    <span
                                        className="uppercase font-bold text-sm opacity-40 flex-grow">{node.basisData?.name}</span>
                                    <div className={'w-6 h-6 flex-none'}>
                                        {(node.basisData?.icon) ? <img
                                            className="dark:invert opacity-50"
                                            src={node.basisData?.icon ?? undefined}
                                            alt={'icon'}
                                        /> : <div/>
                                        }
                                    </div>
                                </h2>
                                {/*<Separator/>*/}
                                <ScrollArea className="pt-2 px-1">
                                    <div className="space-y-1 p-1">
                                        {node.children?.map((child, i) => {
                                            if (hasStateObjects(child.basisData)) {
                                                return (
                                                    <Button
                                                        key={`${child}-${i}`}
                                                        variant="ghost"
                                                        className="w-full justify-start font-normal"
                                                        onClick={() => onTreeNodeClicked(child)}
                                                    >
                                                        <div className={'w-8 h-8 mr-2'}>
                                                            {(child.basisData?.icon) ? <img
                                                                className="dark:invert opacity-50"
                                                                src={child.basisData?.icon ?? undefined}
                                                                alt={'icon'}
                                                            /> : <div/>
                                                            }
                                                        </div>
                                                        <span
                                                            className="font-bold">{child.basisData?.name}</span>

                                                    </Button>
                                                );
                                            }
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
