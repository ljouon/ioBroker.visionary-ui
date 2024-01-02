import { useCallback, useEffect, useRef, useState } from 'react';

export type MessageHandler = (message: MessageEvent) => void;

export type ConnectionState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN';

export function useWebSocket(onMessage: MessageHandler) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connectionState, setConnectionState] = useState<ConnectionState>('UNKNOWN');
    const messageHandlerRef = useRef<MessageHandler>(onMessage);

    // Connect
    useEffect(() => {
        const webSocket = new WebSocket(
            `${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${window.location.host}`,
        );

        webSocket.onopen = () => {
            // NO OP
        };

        webSocket.onerror = (error) => {
            console.error('WebSocket error', JSON.stringify(error, ['message', 'arguments', 'type', 'name']));
        };

        webSocket.onmessage = (message) => {
            messageHandlerRef.current(message);
        };

        webSocket.onclose = () => {
            setConnectionState('CLOSED');
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

    const sendMessage = useCallback(
        (message: string) => {
            if (socket) {
                socket.send(message);
            }
        },
        [socket],
    );

    return { sendMessage, connectionState };
}
