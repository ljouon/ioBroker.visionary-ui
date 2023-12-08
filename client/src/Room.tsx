import { VuiRoom } from '../../src/domain';

type RoomProps = {
    room: VuiRoom;
};

export function Room({ room }: RoomProps) {
    return (
        <>
            <div>Room: {room.name}</div>
        </>
    );
}
