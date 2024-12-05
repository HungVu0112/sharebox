import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface UnreadMesContextType {
    unreadMes: number,
    setUnreadMes: React.Dispatch<React.SetStateAction<number>>
}

const UnreadMesContext = createContext<UnreadMesContextType | undefined>(undefined);

export const useUnreadMesContext = () => {
    const context = useContext(UnreadMesContext);
    if (!context) {
        throw new Error('useUnreadMesContext must be used within a UserProvider');
    }
    return context;
}

export const UnreadMesProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [unreadMes, setUnreadMes] = useState<number>(0);

    return (
        <UnreadMesContext.Provider value={{ unreadMes, setUnreadMes }}>
            {children}
        </UnreadMesContext.Provider>
    )
}