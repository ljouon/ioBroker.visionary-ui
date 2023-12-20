import {useNavigate, useParams} from "react-router-dom";
import {AspectNode, findAspectNode} from "@/app/smart-home/structure/aspect";
import {useVuiDataContext} from "@/app/smart-home/data.context";
import {MainAspectSection} from "@/app/smart-home/structure/main-aspect.section";
import {hasStateObjects, isRoom} from "../../../../../src/domain";
import {matchPath} from "@/app/route-utils";

export function MainAspectPage() {
    const {mainAspect, canonicalPath} = useParams();
    const {roomAspectNodes, functionAspectNodes} = useVuiDataContext();
    const navigate = useNavigate()

    // TODO: Error handling / redirect
    if (!canonicalPath) {
        navigate('/home');
        return;
    }

    const nodes = mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes;

    const selectedAspectNode = findAspectNode(nodes, (node: AspectNode) => matchPath(canonicalPath, node.canonicalPath))

    if (!selectedAspectNode) {
        navigate('/home');
        return;
    }

    const mainAspects: AspectNode[] = [];

    if (selectedAspectNode && selectedAspectNode.mainAspect && selectedAspectNode.level < 2) {
        mainAspects.push(selectedAspectNode);
        if (selectedAspectNode.children.length > 0) {
            selectedAspectNode.children.forEach((node: AspectNode) => {
                if (node && node.mainAspect && hasStateObjects(node.mainAspect)) {
                    mainAspects.push(node);
                }
            });
        }
    }

    const pageContent = mainAspects.map((node) => {
        const element = node.mainAspect!;
        return <MainAspectSection key={element.id} id={element.id} type={isRoom(element) ? 'room' : 'function'}/>;
    });

    return <>{pageContent}</>
}