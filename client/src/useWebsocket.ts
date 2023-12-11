import {useCallback, useEffect, useRef, useState} from 'react';

type MessageHandler = (message: MessageEvent) => void;

export type ConnectionState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN';

function useWebSocket(onMessage: MessageHandler) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectionState, setConnectionState] = useState<ConnectionState>('UNKNOWN');
    const messageHandlerRef = useRef<MessageHandler>(onMessage);

    // Connect
    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:8888');
        //const webSocket = new WebSocket('ws://192.168.0.212:8888');

        webSocket.onopen = () => {
            console.log('WebSocket connected');
        };

        webSocket.onerror = (error) => {
            console.error('WebSocket error', JSON.stringify(error, ['message', 'arguments', 'type', 'name']));
        };

        webSocket.onmessage = (message) => {
            messageHandlerRef.current(message);
        };

        webSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(webSocket);

        // Cleanup function
        return () => {
            if (webSocket?.readyState === WebSocket.OPEN) {
                webSocket.close();
            }
        };
    }, []);

    // Update the message handler if it changes
    useEffect(() => {
        messageHandlerRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        switch (socket?.readyState) {
            case WebSocket.CLOSED:
                setConnectionState('CLOSED');
                break;
            case WebSocket.CLOSING:
                setConnectionState('CLOSING');
                break;
            case WebSocket.CONNECTING:
                setConnectionState('CONNECTING');
                break;
            case WebSocket.OPEN:
                setConnectionState('OPEN');
                break;
            default:
                setConnectionState('UNKNOWN');
        }
    }, [socket?.readyState]);

    // Function to send messages
    const sendMessage = useCallback(
        (message: string) => {
            if (socket) {
                socket.send(message);
            }
        },
        [socket],
    );

    return {sendMessage, connectionState};
}

export default useWebSocket;
