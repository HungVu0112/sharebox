"use client"

import { useChatroomListContext } from "@/context/ChatroomListContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import RoomIcon from "./roomIcon";
import { useSelectedRoomContext } from "@/context/SelectedRoomContext";
import { useUnreadMesContext } from "@/context/UnreadMesContext";
import axios from "axios";

export default function ChatroomIcon() {
    const { chatroomList, setChatroomList } = useChatroomListContext();
    const { selectedRoom, setSelectedRoom } = useSelectedRoomContext();
    const { setUnreadMes } = useUnreadMesContext();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    if (chatroomList.length == 0) {
        return null;
    }

    const handleClick = async(chatroom: any) => {
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

    const handleClose = (chatroom: any) => {
        const newChatroom = chatroomList.filter((obj: any) => JSON.stringify(obj) !== JSON.stringify(chatroom));
        setChatroomList(newChatroom);
    }

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-4 justify-end items-center">
            {chatroomList.map((chatroom: any) => {
                const checkFr = user.userId == chatroom.user1Id;
                const friend = {
                    userId: checkFr ? chatroom.user2Id : chatroom.user1Id,
                    avatar : checkFr ? chatroom.user2_avatar : chatroom.user1_avatar,
                }
                return <RoomIcon key={chatroom.chatroomId} chatroom={chatroom} friend={friend} userId={user.userId} handleClick={handleClick} handleClose={handleClose}/>
            })}
        </div>
    )
}