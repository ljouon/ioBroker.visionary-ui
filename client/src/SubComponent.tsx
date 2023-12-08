import { useVuiDataContext } from './vui-data.context.tsx';

export function SubComponent() {
    const { stateObjects } = useVuiDataContext();

    return (
        <>
            <div>{stateObjects.length}</div>
        </>
    );
}
