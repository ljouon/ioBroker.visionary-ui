import { cn } from '@/lib/utils';
import { TreeNode } from '@/App.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Button } from '@/components/ui/button.tsx';
import { VuiEnum } from '../../../../src/domain';

interface SidebarProps<T extends VuiEnum> extends React.HTMLAttributes<HTMLDivElement> {
    treeNodes: TreeNode<T>[];
}

export function Sidebar<T extends VuiEnum>({ className, treeNodes }: SidebarProps<T>) {
    return (
        <div className={cn('pb-12', className)}>
            <div className="space-y-4 py-4">
                {treeNodes?.map((node) => {
                    return (
                        <div key={node.canonicalPath} className="py-2">
                            <h2 className="relative px-7 text-lg font-semibold tracking-tight">{node.data?.name}</h2>
                            <ScrollArea className=" px-1">
                                <div className="space-y-1 p-2">
                                    {node.children?.map((child, i) => (
                                        <Button
                                            key={`${child}-${i}`}
                                            variant="ghost"
                                            className="w-full justify-start font-normal"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-2 h-4 w-4"
                                            >
                                                <path d="M21 15V6" />
                                                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                                <path d="M12 12H3" />
                                                <path d="M16 6H3" />
                                                <path d="M12 18H3" />
                                            </svg>
                                            {child.data?.name}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
