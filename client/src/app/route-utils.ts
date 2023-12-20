import {generatePath} from "react-router-dom";

export function encodePath(path: string) {
    return encodeURI(path.toLowerCase())
}

export function matchPath(encodedPath: string, path: string) {
    return decodeURI(encodedPath).toLowerCase() === path.toLowerCase()
}

export function createAspectPath(aspectKey: string, canonicalPath: string) {
    return generatePath('/:mainAspect/:canonicalPath', {
        mainAspect: aspectKey,
        canonicalPath: encodePath(canonicalPath)
    })
}

