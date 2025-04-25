import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import React from "react";
import { updateGroupMembers, getAllConversationsByUserId } from "../store/slice/conversationSlice";

const HOST_IP = "172.28.82.122"; // nhập ipconfig trên cmd để lấy địa chỉ ipv4


const WEBSOCKET_URL = `http://${HOST_IP}:8080/ws`;

let stompClient = null;
const subscribers = new Map();

export const connectWebSocket = (onConnectCallBack) => {
    if (stompClient && stompClient.connected) {
        console.log("WebSocket already connected, reusing existing client");
        onConnectCallBack?.();
        return stompClient;
    }

    if(stompClient) {
        stompClient.deactivate(); // Ngắt kết nối nếu đã có client cũ
        console.log("Disconnected existing WebSocket client");
    }
    
    const socket = new SockJS(WEBSOCKET_URL);
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,

        debug: (str) => {
            console.log(str);
        },
        onConnect: () => {
            console.log("Connected to WebSocket");
            onConnectCallBack?.();
        },
        onStompError: (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        },
    });
    stompClient.activate();
    return stompClient;
};


// kiem tra xem websocket da ket noi chua, neu chua thi ket noi lai
export const ensureWebSocketConnected = () => {
    return new Promise((resolve, reject) => {
        if (stompClient && stompClient.connected) {
            resolve();
        } else {
            connectWebSocket(() => {
                resolve();
            });
        }
    });
};

export const subscribeToUserProfile = async (userId, onMessageReceived) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }

    //
    const subscription = stompClient.subscribe(
        `/user/profile/${userId}`,
        (message) => {
            if (message.body) {
                onMessageReceived(JSON.parse(message.body));
            }
        }
    );

    subscribers.set(userId, subscription);
};

export const subscribeToChat = async (conversationId, onMessageReceived) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }

    const subscription = stompClient.subscribe(
        `/chat/message/single/${conversationId}`,
        (message) => {
            if (message.body) {
                onMessageReceived(JSON.parse(message.body));
            }
        }
    );

    subscribers.set(conversationId, subscription);
};

export const subscribeToConversation = async (userId, onMessageReceived) => {
    try {
        await ensureWebSocketConnected();
        if (!stompClient || !stompClient.connected) {
            console.error("WebSocket is not connected");
            return;
        }
        console.log("Subscribing to /chat/create/group/" + userId);

        const subscription = stompClient.subscribe(
            `/chat/create/group/${userId}`,
            (message) => {

                if (message.body) {
                    onMessageReceived(JSON.parse(message.body));
                }
                
            }
        );

        subscribers.set(userId, subscription);
    } catch (error) {
        console.error("Error subscribing to conversation:", error);
    }
};

export const subscribeToLeaveConversation = async (userId, onMessageReceived) => {
    try {
        await ensureWebSocketConnected();
        if (!stompClient || !stompClient.connected) {
            console.error("WebSocket is not connected");
            return;
        }
        console.log("Subscribing to /chat/create/group/" + userId);

        const subscription = stompClient.subscribe(
            `/chat/leave/group/${userId}`,
            (message) => {

                if (message.body) {
                    onMessageReceived(JSON.parse(message.body));
                }

            }
        );

        subscribers.set(userId, subscription);
    } catch (error) {
        console.error("Error subscribing to conversation:", error);
    }
};

export const sendMessageToWebSocket = async (messageData) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }

    stompClient.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(messageData),
    });
};

export const recallMessageToWebSocket = async (messageData) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }

    stompClient.publish({
        destination: "/app/chat/recall",
        body: JSON.stringify(messageData),
    });
};

export const deleteMessageToWebSocket = async (messageData) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }
    console.log("deleteMessageToWebSocket", messageData);

    stompClient.publish({
        destination: "/app/chat/delete-for-user",
        body: JSON.stringify(messageData),
    });
};
export const sendFileToWebSocket = async (messageFormData) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }
    console.log("sendFileToWebSocket", messageFormData.parts);

    stompClient.publish({
        destination: "/app/chat/file/upload",
        body: JSON.stringify(messageFormData),
    });
};

export const forwardMessageToWebSocket = async (messageFormData) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }
    console.log("forwardMessageToWebSocket", messageFormData.parts);

    stompClient.publish({
        destination: "/app/chat/forward",
        body: JSON.stringify(messageFormData),
    });
};

export const createGroupToWebSocket = async (request) => {
    await ensureWebSocketConnected();
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected");
        return;
    }
    console.log("createGroupToWebSocket", request);

    stompClient.publish({
        destination: "/app/conversation/create-group",
        body: JSON.stringify(request),
    });
};

export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        subscribers.clear();
    }
};
