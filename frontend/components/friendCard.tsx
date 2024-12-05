import Image from "next/image";
import CircleIcon from "@/public/circle-solid-green.svg"
import { useEffect, useState } from "react";
import axios from "axios";

export default function FriendCard({ friend, user, handleClick } : { friend: any, user: any, handleClick: (chatroom: any) => Promise<void> }) {
    const [chatroom, setChatroom] = useState<any>();

    useEffect(() => {
        const getChatRoom = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/chatroom/get/${user.userId}/${friend.userId}`
            )
            if (res.data.result) setChatroom(res.data.result);
        }
        getChatRoom();
    }, [])

    return (
        <div onClick={() => handleClick(chatroom)} className="w-full flex gap-4 items-center p-4 hover:bg-slate-100 cursor-pointer rounded-md">
            <div className="relative w-[60px] h-[60px]">
                <img src={friend.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full shadow-xl" />
                <Image
                    src={CircleIcon}
                    alt="Online Icon"
                    className="absolute bottom-0 right-0 w-[15px]"
                />
            </div>
            <p className="text-textHeadingColor font-semibold">{friend.username}</p>
        </div>
    )
}