import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface FriendReqListContextType {
    friendReqList: any[],
    setFriendReqList: React.Dispatch<React.SetStateAction<any[]>>,
    setRefresh: React.Dispatch<React.SetStateAction<number>>
}

const FriendReqListContext = createContext<FriendReqListContextType | undefined>(undefined);

export const useFriendReqListContext = () => {
    const context = useContext(FriendReqListContext);
    if (!context) {
        throw new Error('useFriendReqListContext must be used within a UserProvider');
    }
    return context;
}

export const FriendReqListProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [friendReqList, setFriendReqList] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        if (user.userId) {
            const getFriendReqList = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/friend/pending?receiverId=${user.userId}`
                )
                if (res.data.result) setFriendReqList(res.data.result.reverse());
            }
            getFriendReqList();
        }
    }, [refresh])

    return (
        <FriendReqListContext.Provider value={{ friendReqList, setFriendReqList, setRefresh }}>
            {children}
        </FriendReqListContext.Provider>
    )
}