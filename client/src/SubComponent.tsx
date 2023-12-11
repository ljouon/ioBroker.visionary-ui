import { useVuiDataContext } from './vui-data.context';

export function SubComponent() {
    const { stateObjects } = useVuiDataContext();

    return (
        <>
            <div>{stateObjects.length}</div>
        </>
    );
}
