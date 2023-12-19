import {useParams} from "react-router-dom";
import {AspectNode, findAspectNodeById} from "@/app/smart-home/structure/aspect";
import {useVuiDataContext} from "@/app/smart-home/data.context";
import {MainAspectSection} from "@/app/smart-home/structure/main-aspect.section";
import {hasStateObjects, isRoom} from "../../../../../src/domain";

export function MainAspectPage() {
    const {mainAspect, aspectId} = useParams();
    const {roomAspectNodes, functionAspectNodes} = useVuiDataContext();

    // TODO: Error handling / redirect
    if (!aspectId) {
        return <div>aspectId missing!</div>
    }

    const nodes = mainAspect === 'rooms' ? roomAspectNodes : functionAspectNodes;

    const selectedAspectNode = findAspectNodeById(nodes, aspectId)

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