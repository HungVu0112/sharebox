import { useOnlineFriendContext } from "@/context/OnlineFriendContext"
import websocketService from "@/websoket/websocket-service";
import { useEffect } from "react";
import FriendCard from "./friendCard";
import { useSelectedRoomContext } from "@/context/SelectedRoomContext";
import { useChatroomListContext } from "@/context/ChatroomListContext";
import axios from "axios";
import { useUnreadMesContext } from "@/context/UnreadMesContext";

export default function OnlineCard() {
    const { onlineFriend, setRenewOnline } = useOnlineFriendContext();
    const { chatroomList, setChatroomList } = useChatroomListContext();
    const { setUnreadMes } = useUnreadMesContext();
    const { selectedRoom, setSelectedRoom } = useSelectedRoomContext();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {}; 

    useEffect(() => {
        websocketService.subscribe(`/topic/user/online/${user.userId}`, mes => {
            setRenewOnline(n=>n+1);
        })

        return () => {
            websocketService.unsubscribe(`/topic/user/online/${user.userId}`);
        }
    }, [])

    useEffect(() => {
        setRenewOnline(n=>n+1);
    }, [])

    const handleOpenChatBox = async(chatroom: any) => {
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

    return (
        <div className="fixed w-[20%] right-8 top-[520px] border border-lineColor rounded-lg p-5">
            <h1 className="text-xl text-textHeadingColor font-semibold">Onlines</h1>
            <div className="w-full max-h-[300px] mt-4 flex flex-col gap-4 overflow-y-scroll com">
                {onlineFriend.length == 0 ?
                    <p className="text-sm text-textGrayColor1 text-center font-semibold">No one is online !</p>
                    :
                    <>
                        {onlineFriend.map((friend: any) => {
                            return <FriendCard key={friend.userId} friend={friend} user={user} handleClick={handleOpenChatBox}/>
                        })}
                    </>
                }
            </div>
        </div>
    )
}