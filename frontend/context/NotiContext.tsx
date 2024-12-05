import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface NotiContextType {
    noti: any[],
    setNoti: React.Dispatch<React.SetStateAction<any[]>>,
    setRenew: React.Dispatch<React.SetStateAction<number>>
}

const NotiContext = createContext<NotiContextType | undefined>(undefined);

export const useNotiContext = () => {
    const context = useContext(NotiContext);
    if (!context) {
        throw new Error('useNotiContext must be used within a UserProvider');
    }
    return context;
}

export const NotiProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [noti, setNoti] = useState<any[]>([]);
    const [renew, setRenew] = useState<number>(0);

    useEffect(() => {
        if (user.userId) {
            const getNoti = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/noti/receiver/${user.userId}`
                )
                if (res.data.result) setNoti(res.data.result.reverse());
            }
            getNoti();
        }
    }, [renew])

    return (
        <NotiContext.Provider value={{ noti, setNoti, setRenew }}>
            {children}
        </NotiContext.Provider>
    )
}