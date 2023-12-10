import { cn } from '@/lib/utils';
import { TreeNode } from '@/App.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Button } from '@/components/ui/button.tsx';
import { VuiEnum } from '../../../../src/domain';

interface SidebarProps<T extends VuiEnum> extends React.HTMLAttributes<HTMLDivElement> {
    treeNodes: TreeNode<T>[];
}

export function Sidebar<T extends VuiEnum>({ className, treeNodes }: SidebarProps<T>) {
    function hasStateObjects<T extends VuiEnum>(node: TreeNode<T>) {
        // return true;
        return node.data && node.data.members ? node.data.members.length > 0 : false;
    }

    function hasChildren<T extends VuiEnum>(node: TreeNode<T>) {
        // return true;
        return node.children.length > 0;
    }

    return (
        <div className={cn('pb-12', className)}>
            <div className="space-y-4 py-4">
                {treeNodes?.map((node) => {
                    if (hasChildren(node) || hasStateObjects(node)) {
                        return (
                            <div key={node.canonicalPath} className="py-1">
                                <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                    {node.data?.name}
                                </h2>
                                <ScrollArea className="px-1">
                                    <div className="space-y-1 p-1">
                                        {node.children?.map((child, i) => {
                                            if (hasStateObjects(child)) {
                                                return (
                                                    <Button
                                                        key={`${child}-${i}`}
                                                        variant="ghost"
                                                        className="w-full justify-start font-normal"
                                                    >
                                                        <div className={'w-8 pr-2'}>
                                                            <img
                                                                className="dark:invert opacity-50"
                                                                src={child.data?.icon ?? undefined}
                                                                alt={'icon'}
                                                            />
                                                        </div>
                                                        {child.data?.name}
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
