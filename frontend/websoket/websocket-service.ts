import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

interface Notification {
    type: 'FRIEND_REQUEST' | 'FRIEND_REQUEST_RESPONSE';
    message: string;
    senderId: string;
}

interface FriendRequest {
    id: string;
    requester: {
        id: string;
        username: string;
    };
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

class WebsocketService {
    private client: Client | null = null;
    private userId: string | null = null;
    private subscriptions: Map<string, (message: any) => void> = new Map();

    connect(userId: string) {
        if (this.client) {
            this.client.deactivate();
        }

        this.userId = userId;
        this.client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/authentication/ws"),
            onConnect: () => {
                console.log("Websocket connected!");
                this.resubscribeAllTopics();
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers['message']);
            },
            reconnectDelay: 5000
        });

        this.client.activate();
    }

    // Phương thức để đăng ký subscribe mới
    subscribe(topic: string, callback: (message: any) => void) {
        this.subscriptions.set(topic, callback);
        
        // Nếu đã kết nối, subscribe ngay lập tức
        if (this.client && this.client.connected) {
            this.client.subscribe(topic, (message) => {
                callback(message.body);
            });
        }
    }

    // Phương thức để hủy subscribe
    unsubscribe(topic: string) {
        this.subscriptions.delete(topic);
    }

    // Tái đăng ký tất cả các topic khi kết nối lại
    private resubscribeAllTopics() {
        this.subscriptions.forEach((callback, topic) => {
            if (this.client) {
                this.client.subscribe(topic, (message) => {
                    callback(message.body);
                });
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
        this.subscriptions.clear();
    }
}

export default new WebsocketService();