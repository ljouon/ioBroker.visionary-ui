import { useCallback, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Box } from '@mui/joy';
import Icon from '@mui/material/Icon';
import green from '@mui/material/colors/green';
import { SubComponent } from './SubComponent.tsx';
import { useVuiDataContext } from './vui-data.context.tsx';

function App() {
    const [count, setCount] = useState<number>(0);

    const { rooms, functions, stateObjects, stateValues, connectionState, sendMessage } = useVuiDataContext();

    // const sendMessage = (text: string) => {};
    // const rooms = [];

    const handleClickSendMessage = useCallback(
        (counter: number) => {
            const newCount = counter + 1;
            setCount(newCount);
            sendMessage(`Hello WebSocket! ${newCount}`);
        },
        [sendMessage],
    );

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Client with websocket connection</h1>

            <div className="card">
                <Box
                    sx={{
                        '& > :not(style)': {
                            m: 2,
                        },
                    }}
                >
                    <Icon>camera</Icon>
                    <Icon color="primary">house</Icon>
                    <Icon sx={{ color: green[500] }}>camera</Icon>
                    <Icon fontSize="small">camera</Icon>
                    <Icon sx={{ fontSize: 50 }}>camera</Icon>
                </Box>

                <p>
                    {connectionState === 'OPEN' ? (
                        <Icon sx={{ fontSize: 50 }}>sync</Icon>
                    ) : (
                        <Icon sx={{ fontSize: 50 }}>sync_problem</Icon>
                    )}
                </p>
                {/*disabled={readyState !== ReadyState.OPEN}*/}
                <button onClick={() => handleClickSendMessage(count)}>count is {count}</button>
            </div>
            <ul>
                <p>Rooms: {rooms.length}</p>
                <p>Functions: {functions.length}</p>
                <p>Objects: {stateObjects.length}</p>
                <p>States: {stateValues.length}</p>
            </ul>
            <ul>
                <SubComponent />
                {/*{messages.map((message, idx) => (*/}
                {/*    <p key={idx}>{message ? message : null}</p>*/}
                {/*))}*/}
            </ul>
        </>
    );
}

export default App;
