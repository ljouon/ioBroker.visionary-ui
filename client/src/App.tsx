import { useCallback, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Box } from '@mui/joy';
import Icon from '@mui/material/Icon';
import green from '@mui/material/colors/green';

function App() {
    const [count, setCount] = useState<number>(0);

    // --- TEMP ----

    // const ws = new WebSocket('ws://localhost:8888');
    //
    // ws.addEventListener('open', () => {
    //     console.log('Connected to server');
    //
    //     ws.send('Hello, server!');
    // });
    //
    // ws.addEventListener('message', (event: MessageEvent) => {
    //     console.log(`Received message from server: ${event.data}`);
    // });
    //
    // ws.addEventListener('close', () => {
    //     console.log('Disconnected from server');
    // });

    const [socketUrl] = useState('ws://localhost:8888');
    const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const handleClickSendMessage = useCallback(
        (counter: number) => {
            const newCount = counter + 1;
            setCount(newCount);
            sendMessage('' + newCount);
        },
        [sendMessage],
    );

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

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

                <p>{connectionStatus}</p>
                <button disabled={readyState !== ReadyState.OPEN} onClick={() => handleClickSendMessage(count)}>
                    count is {count}
                </button>
                <p>{connectionStatus}</p>
            </div>
            <ul>
                {messageHistory.map((message, idx) => (
                    <p key={idx}>{message ? message.data : null}</p>
                ))}
            </ul>
        </>
    );
}

export default App;
