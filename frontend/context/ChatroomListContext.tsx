import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ChatroomListContextType {
    chatroomList: any[],
    setChatroomList: React.Dispatch<React.SetStateAction<any[]>>
}

const ChatroomListContext = createContext<ChatroomListContextType | undefined>(undefined);

export const useChatroomListContext = () => {
    const context = useContext(ChatroomListContext);
    if (!context) {
        throw new Error('useChatroomListContext must be used within a UserProvider');
    }
    return context;
}

export const ChatroomListProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [chatroomList, setChatroomList] = useState<any[]>([]);

    return (
        <ChatroomListContext.Provider value={{ chatroomList, setChatroomList }}>
            {children}
        </ChatroomListContext.Provider>
    )
}