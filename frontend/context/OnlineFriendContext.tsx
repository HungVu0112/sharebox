import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface OnlineFriendContextType {
    onlineFriend: any[],
    setOnlineFriend: React.Dispatch<React.SetStateAction<any[]>>,
    setRenewOnline: React.Dispatch<React.SetStateAction<number>>
}

const OnlineFriendContext = createContext<OnlineFriendContextType | undefined>(undefined);

export const useOnlineFriendContext = () => {
    const context = useContext(OnlineFriendContext);
    if (!context) {
        throw new Error('useOnlineFriendContext must be used within a UserProvider');
    }
    return context;
}

export const OnlineFriendProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [onlineFriend, setOnlineFriend] = useState<any[]>([]);
    const [renew, setRenewOnline] = useState<number>(0);

    useEffect(() => {
        if (user.userId) {
            const getOnlineFriend = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/friend/online-list/${user.userId}`
                )
                if (res.data.result) setOnlineFriend(res.data.result);
            }
            getOnlineFriend();
        }
    }, [renew])

    return (
        <OnlineFriendContext.Provider value={{ onlineFriend, setOnlineFriend, setRenewOnline }}>
            {children}
        </OnlineFriendContext.Provider>
    )
}