import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


const HOST_IP = '192.168.236.41'; // nhập ipconfig trên cmd để lấy địa chỉ ipv4

const WEBSOCKET_URL = `http://${HOST_IP}:8080/ws`

let stompClient = null;
const subscribers = new Map();

export const connectWebSocket = (onConnectCallBack) => {
    if(stompClient && stompClient.connected) {
        return stompClient;
    }
    const socket = new SockJS(WEBSOCKET_URL);
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => {
            console.log(str);
        },
        onConnect: () => {
            console.log('Connected to WebSocket');
            onConnectCallBack?.();
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
    });
    stompClient.activate();
}

export const subscribeToUserProfile = (userId, onMessageReceived) => {
    if (!stompClient || !stompClient.connected) {
        console.error('WebSocket is not connected');
        return;
    }

    // 
    const subscription = stompClient.subscribe(`/user/profile/${userId}`, (message) => {
        if (message.body) {
            onMessageReceived(JSON.parse(message.body));
        }
    });

    subscribers.set(userId, subscription);
}

export const subscribeToChat = (conversationId, onMessageReceived) => {
    
    if (!stompClient || !stompClient.connected) {
        console.error('WebSocket is not connected');
        return;
    }

    const subscription = stompClient.subscribe(`/chat/message/single/${conversationId}`, (message) => {
        if (message.body) {
            onMessageReceived(JSON.parse(message.body));
        }
    });

    subscribers.set(conversationId, subscription);
}

export const sendMessageToWebSocket = (messageData) => {
    if (!stompClient || !stompClient.connected) {
        console.error('WebSocket is not connected');
        return;
    }

    stompClient.publish({
        destination: '/app/chat/send',
        body: JSON.stringify(messageData),
    })
}


export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        subscribers.clear();
    }
};