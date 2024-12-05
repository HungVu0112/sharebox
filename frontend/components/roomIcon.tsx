import CloseIcon from "@/public/xmark-solid.svg";
import websocketService from "@/websoket/websocket-service";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RoomIcon({ chatroom, friend, userId, handleClick, handleClose }: { chatroom: any, friend: any, userId: number, handleClick: (chatroom: any) => Promise<void>, handleClose: (chatroom: any) => void }) {
    const [unseenNum, setUnseenNum] = useState<number>(0);
    const [reload, setReload] = useState<number>(0);

    useEffect(() => {
        const getMesList = async() => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/authentication/message/get/${chatroom.chatroomId}`
                );
                if (res.data.result) {
                    const ml = [...res.data.result];          
                    setUnseenNum(ml.filter(mes => mes.seen === false && mes.receriverId === userId).length);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
        getMesList();
    }, [reload])

    useEffect(() => {
        websocketService.subscribe(`/topic/message/unseen/${chatroom.chatroomId}/${userId}`, mes => {
            setReload(n=>n+1);
        })

        return () => {
            websocketService.unsubscribe(`/topic/message/unseen/${chatroom.chatroomId}/${userId}`);
        }
    }, [])

    return (
        <div key={friend.userId} className="relative w-[60px] h-[60px] roomicon cursor-pointer">
            <img onClick={() => handleClick(chatroom)} src={friend.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full"/>
            <div onClick={() => handleClose(chatroom)} className="absolute w-[20px] h-[20px] top-[0px] right-[-8px] rounded-full bg-warningColor flex items-center justify-center cursor-pointer closeicon">
                <Image
                    src={CloseIcon}
                    alt="Clost Icon"
                    className="w-[10px]"
                />
            </div>
            {unseenNum > 0 &&
                <div className="absolute w-[20px] h-[20px] top-[0px] right-[-8px] rounded-full bg-warningColor flex items-center justify-center numcircle">
                    <p className="text-white text-[10px] font-bold">{unseenNum}</p>
                </div>
            }
        </div>
    )
}