import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ChatroomContextType {
    chatroom: any[],
    setChatroom: React.Dispatch<React.SetStateAction<any[]>>,
    setRenewRoom: React.Dispatch<React.SetStateAction<number>>
}

const ChatroomContext = createContext<ChatroomContextType | undefined>(undefined);

export const useChatroomContext = () => {
    const context = useContext(ChatroomContext);
    if (!context) {
        throw new Error('useChatroomContext must be used within a UserProvider');
    }
    return context;
}

export const ChatroomProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [chatroom, setChatroom] = useState<any[]>([]);
    const [renew, setRenewRoom] = useState<number>(0);

    useEffect(() => {
        if (user.userId) {
            console.log("im in");
            
            const getChatroom = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/chatroom/getAll/${user.userId}`
                )
                if (res.data.result) setChatroom(res.data.result);
            }
            getChatroom();
        }
    }, [renew])

    return (
        <ChatroomContext.Provider value={{ chatroom, setChatroom, setRenewRoom }}>
            {children}
        </ChatroomContext.Provider>
    )
}