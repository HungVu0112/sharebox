import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface SelectedRoomContextType {
    selectedRoom: any,
    setSelectedRoom: React.Dispatch<React.SetStateAction<any>>
}

const SelectedRoomContext = createContext<SelectedRoomContextType | undefined>(undefined);

export const useSelectedRoomContext = () => {
    const context = useContext(SelectedRoomContext);
    if (!context) {
        throw new Error('useSelectedRoomContext must be used within a UserProvider');
    }
    return context;
}

export const SelectedRoomProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    return (
        <SelectedRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
            {children}
        </SelectedRoomContext.Provider>
    )
}