import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import CircleDot from "@/public/circle-solid-red.svg";
import Image from "next/image";
import websocketService from "@/websoket/websocket-service";
import { useChatroomListContext } from "@/context/ChatroomListContext";

export default function ChatroomCard({ chatroom, user, setUnreadMes, setSelectedRoom, selectedRoom } : { chatroom: any, user: any, setUnreadMes: (value: SetStateAction<number>) => void, setSelectedRoom: (value: SetStateAction<any>) => void, selectedRoom: any}) {
    const { chatroomList, setChatroomList } = useChatroomListContext();
    const checkFr = user.userId == chatroom.user1Id;
    const friend = {
        userId: checkFr ? chatroom.user2Id : chatroom.user1Id,
        username : checkFr ? chatroom.user2_username : chatroom.user1_username,
        avatar : checkFr ? chatroom.user2_avatar : chatroom.user1_avatar,
    }
    const [latestMes, setLatestMes] = useState<any>();
    const [refresh, setRefresh] = useState<number>(0);


    useEffect(() => {
        const getLatestMes = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/message/getlatest/${chatroom.chatroomId}`
            )
            if (res.data.result) {
                if (!res.data.result.seen && (res.data.result.senderId != user.userId)) setUnreadMes(n=>n+1);
                setLatestMes(res.data.result);
            };
        }
        getLatestMes();
    }, [refresh])

    const handleOpenChatBox = async() => {
        var newRoomArr: any[] = [...chatroomList]; 
        if (selectedRoom != null && selectedRoom !== chatroom) {
            await axios.post(
                `http://localhost:8080/authentication/chatroom/change-status?chatroomId=${selectedRoom.chatroomId}&userId=${user.userId}&status=LEAVE`
            )
            const newChatroom = chatroomList.filter((obj: any) => JSON.stringify(obj) !== JSON.stringify(selectedRoom) && JSON.stringify(obj) !== JSON.stringify(chatroom));
            newChatroom.push(selectedRoom);
            newRoomArr = [...newChatroom];
        }

        const newChatroom = newRoomArr.filter((obj: any) => JSON.stringify(obj) !== JSON.stringify(chatroom));
        setChatroomList(newChatroom);

        await axios.post(
            `http://localhost:8080/authentication/chatroom/change-status?chatroomId=${chatroom.chatroomId}&userId=${user.userId}&status=IN`
        )

        const res = await axios.post(
            `http://localhost:8080/authentication/message/setSeen/${chatroom.chatroomId}/${user.userId}`
        )
        if (res.data.result) setUnreadMes(n=>n-res.data.result);
        
        setSelectedRoom(chatroom);
    }

    useEffect(() => {
        websocketService.subscribe(`/topic/message/${chatroom.chatroomId}`, mes => {
            setRefresh(n=>n+1);
        })

        websocketService.subscribe(`/topic/message/seen/${chatroom.chatroomId}/${user.userId}`, mes => {
            setRefresh(n=>n+1);
        })

        return () => {
            websocketService.unsubscribe(`/topic/message/${chatroom.chatroomId}`)
            websocketService.unsubscribe(`/topic/message/seen/${chatroom.chatroomId}/${user.userId}`)
        }
    }, [])

    return (
        <div onClick={handleOpenChatBox} className="relative flex items-center gap-4 p-4 rounded-md hover:bg-slate-100 cursor-pointer duration-150">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <img src={friend.avatar} alt="Avatar" className="w-full h-full object-cover"/>
            </div> 
            <div className="max-w-[250px]">
                <h3 className="text-textHeadingColor font-bold">{friend.username}</h3>
                {latestMes && 
                    <p className={`whitespace-nowrap overflow-hidden text-ellipsis text-sm text-textGrayColor1 ${!latestMes.seen && latestMes.senderId != user.userId && "font-bold"}`}>{latestMes.senderId == user.userId ? "You: " : (friend.username + ": ")}{latestMes.type == "TEXT" ? latestMes.content : "just send a media."}</p>
                }
            </div>
            {(latestMes && !latestMes.seen && (latestMes.senderId != user.userId)) && 
                <div className="absolute w-[12px] h-full flex items-center top-0 right-6">
                    <Image 
                        src={CircleDot}
                        alt="Circle dot"
                        className="w-[12px]"
                    />
                </div>
            }
        </div>
    )
}