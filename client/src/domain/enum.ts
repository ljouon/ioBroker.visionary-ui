import {VuiEnum} from "../../../src/domain";
import {TreeNode} from "@/domain/logics";

export function hasChildren<T extends VuiEnum, S extends VuiEnum>(node: TreeNode<T, S>) {
    return node.children.length > 0;
}