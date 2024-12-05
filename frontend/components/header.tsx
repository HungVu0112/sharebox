'use client'

import Image from "next/image";
import Logo from "../public/parachute-box-solid.svg";
import GlassIcon from "../public/magnifying-glass-solid.svg";
import ChatIcon from "../public/comment-solid.svg";
import PlusIcon from "../public/plus-solid-black.svg";
import NotifiIcon from "../public/bell-solid.svg";
import CircleDot from "@/public/circle-solid-red.svg";
import UserIcon from "@/public/user-plus-solid.svg";
import UserIconGrey from "@/public/user-plus-solid-grey.svg";
import PostIcon from "@/public/paper-plane-solid.svg";
import PostIconGrey from "@/public/paper-plane-solid-grey.svg";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import websocketService from "@/websoket/websocket-service";
import ToastMessage from "./toastMessage";
import { useFriendReqListContext } from "@/context/FriendReqContext";
import { useNotiContext } from "@/context/NotiContext";
import FriendReqCard from "./friendReqCard";
import CommentNotiCard from "./commentNotiCard";
import { useChatroomContext } from "@/context/ChatroomContext";
import ChatroomCard from "./chatroomCard";
import { useSelectedRoomContext } from "@/context/SelectedRoomContext";
import { useUnreadMesContext } from "@/context/UnreadMesContext";

export default function Header({ user } : { user: any }) {
    const notiBox = useRef<HTMLDivElement>(null);
    const chatListBox = useRef<HTMLDivElement>(null);
    const { friendReqList, setRefresh } = useFriendReqListContext();
    const { noti, setRenew } = useNotiContext();
    const { chatroom, setRenewRoom } = useChatroomContext();
    const { selectedRoom, setSelectedRoom } = useSelectedRoomContext();
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>(""); 
    const [friendName, setFriendName] = useState<string>(""); 
    const [searchRes, setSearchRes] = useState<any[]>([]);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [isOnFriend, setIsOnFriend] = useState<boolean>(true);
    const { unreadMes, setUnreadMes } = useUnreadMesContext();
    const [reload, setReload] = useState<number>(0);
    const [message, setMessage] = useState<{
      type: string,
      message: string,
      redirect: boolean,
      image?: string,
      comment?: string
    }>({
      type: "",
      message: "",
      redirect: false,
    });    

    const handleChange = (e: any) => {
        setSearchText(e.target.value);
    }

    const handleShowNotiBox = () => {
        notiBox.current?.classList.toggle("hidden");
    }

    const handleShowChatListBox = () => {
        chatListBox.current?.classList.toggle("hidden");
    }

    useEffect(() => {
        if (searchText != "") {
            const getSearchRes = async() => {
                const res = await axios.post(
                    `http://localhost:8080/authentication/community/search`,
                    {
                        keyword: searchText
                    }
                )
                if (res.data.result) setSearchRes(res.data.result);
            }
            getSearchRes();
        }
    }, [searchText])

    useEffect(() => {
        websocketService.subscribe(`/topic/user/${user.userId}`, (message) => {
            const mes = JSON.parse(message);
            const str = "just commented on your post!";
            const str2 = "You have a new friend request";
            
            if (mes.message.includes(str)) {
                const index = mes.message.indexOf(str) + str.length;
                const message = mes.message.substring(0, index);
                const comment = mes.message.substring(index, mes.message.length);
                
                setReload(n=>n+1);
                setRenew(n=>n+1);
                setMessage({
                    type: "noti",
                    message: message,
                    redirect: false,
                    image: mes.image,
                    comment: comment
                })
            } else {
                if (mes.message.includes(str2)) {
                    setReload(n=>n+1);
                    setRefresh(n=>n+1);
                }
                setMessage({
                    type: "noti",
                    message: mes.message,
                    redirect: false,
                    image: mes.image
                })
            }
            setShowMessage(true);
        })

        return () => {
            websocketService.unsubscribe(`/topic/user/${user.userId}`)
        }
    }, [])

    useEffect(() => {
        setRenewRoom(n=>n+1);
        setRefresh(n=>n+1);
        setRenew(n=>n+1);
    }, [])

    console.log(unreadMes);
    
    return (
        <div className="fixed bg-white z-[60] top-0 left-0 flex justify-between items-center p-4 w-full h-[80px] border border-b-lineColor select-none">
            <div className="ml-6 flex items-center gap-2 select-none">
                <Image 
                    src={Logo}
                    alt="Logo"
                    className="w-[35px]"
                />
                <p className="text-mainColor text-[20px] font-bold">Share Box</p>
            </div>

            <div className="relative flex items-center gap-4 p-4 w-[600px] h-[50px] bg-boxBackground rounded-full">
                <Image 
                    src={GlassIcon}
                    alt="Glass Icon"
                    className="w-[20px]"
                />
                <input type="text" value={searchText} onChange={handleChange} className="bg-transparent w-[500px] outline-none" placeholder="Search something..."/>
                {searchText != "" && 
                    <div className="absolute w-[90%] p-4 top-[60px] border border-lineColor shadow-xl rounded-lg left-[5%] bg-white z-[70]">
                        <h2 className="font-bold text-textHeadingColor">COMMUNITIES</h2>
                        <div className="mt-3 max-h-[300px] overflow-y-scroll com">
                            {searchRes.length == 0 ? 
                                <p className="text-center text-textGrayColor1 font-semibold text-sm">No communities found !</p>
                                :
                                <>
                                {searchRes.map((com: any, index: number) => {
                                    return <div onClick={()=>router.push(`/community/${com.communityId}`)} key={index} className="w-full p-3 flex gap-3 hover:bg-slate-100 rounded-md cursor-pointer">
                                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                            <img src={com.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="">
                                            <h3 className="font-bold">{com.name}</h3>
                                            <p className="text-sm text-textGrayColor1">{com.members.length} members</p>
                                        </div>
                                    </div>
                                })}
                                </>
                            }
                        </div>
                        <div onClick={()=>router.push(`/search/${searchText}`)} className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-slate-100 cursor-pointer">
                            <Image 
                                src={GlassIcon}
                                alt="Glass Icon"
                                className="w-[20px]"
                            />
                            <p className="text-sm text-textGrayColor1 font-semibold">Search for posts with "{searchText}"</p>
                        </div>
                    </div>
                }
            </div>

            <div className="flex gap-10 items-center">
                <div className="relative">
                    <Image
                        src={ChatIcon}
                        alt="Chat Icon"
                        className="w-[30px] hover:scale-[1.05] duration-150 cursor-pointer"
                        onClick={handleShowChatListBox}
                    />
                    {unreadMes > 0 &&
                        <Image
                            src={CircleDot}
                            alt="Circle Dot"
                            className="absolute w-[12px] top-[0px] -right-[4px]"
                        />
                    }
                </div>

                <div ref={chatListBox} className="hidden absolute w-[460px] top-[70px] right-[90px] p-4 rounded-md shadow-xl z-[70] bg-white border border-slate-200">
                    <div className="flex items-center w-full gap-4 py-2 px-4 rounded-full bg-slate-100">
                        <Image
                            src={GlassIcon}
                            alt="Glass Icon"
                            className="w-[15px]"
                        />
                        <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)} className="text-sm bg-transparent w-[80%] outline-none" placeholder="Search for friend's name..." />
                    </div>
                    <div className="w-full flex flex-col gap-2 mt-2">
                        {chatroom.length == 0 ?
                            <p className="text-center text-sm text-textGrayColor1">You don't have any friends !</p>
                            :
                            <>
                                {chatroom.filter(room =>
                                    friendName === "" ||
                                    (room.user1Id === user.userId
                                        ? room.user2_username.toLowerCase().includes(friendName.toLowerCase())
                                        : room.user1_username.toLowerCase().includes(friendName.toLowerCase())
                                    )
                                )
                                    .map((room: any, index: number) => {
                                        return <ChatroomCard key={index} chatroom={room} user={user} setUnreadMes={setUnreadMes} setSelectedRoom={setSelectedRoom} selectedRoom={selectedRoom} />
                                    })}
                            </>
                        }
                    </div>

                </div>

                <div onClick={() => { 
                    sessionStorage.setItem("selectedCommunity", "");                 
                    router.push("/createpost") }} className="flex gap-1 items-center hover:scale-[1.1] cursor-pointer">
                    <Image 
                        src={PlusIcon}
                        alt="Chat Icon"
                        className="w-[25px]"
                    />
                    <p className="font-bold text-lg">Create</p>
                </div>
                
                <div className="relative">
                    <Image 
                        src={NotifiIcon}
                        alt="Notifi Icon"
                        className="w-[25px] hover:scale-[1.05] duration-150 cursor-pointer"
                        onClick={handleShowNotiBox}
                    />
                    {(noti.length != 0 || friendReqList.length != 0) && 
                        <Image 
                            src={CircleDot}
                            alt="Circle Dot"
                            className="absolute w-[12px] top-[0px] -right-[4px]"
                        />
                    }
                </div>

                <div ref={notiBox} className="hidden absolute top-[70px] right-[60px] w-[420px] p-4 rounded-md shadow-xl z-[70] bg-white border border-slate-200">
                    <div className="flex gap-2">
                        <div onClick={() => setIsOnFriend(!isOnFriend)} className={`flex-1 h-[40px] flex items-center justify-center cursor-pointer hover:bg-slate-100 duration-150 ${isOnFriend && "border-b-2 border-textHeadingColor"}`}>
                            <div className="relative">
                                <Image
                                    src={isOnFriend ? UserIcon : UserIconGrey}
                                    alt="User Icon"
                                    className="w-[20px]"
                                />
                                {(friendReqList.length != 0) &&
                                    <Image
                                        src={CircleDot}
                                        alt="Circle Dot"
                                        className="absolute w-[10px] top-[0px] -right-[4px]"
                                    />
                                }
                            </div>
                        </div>
                        <div onClick={() => setIsOnFriend(!isOnFriend)} className={`flex-1 h-[40px] flex items-center justify-center cursor-pointer hover:bg-slate-100 duration-150 ${!isOnFriend && "border-b-2 border-textHeadingColor"}`}>
                            <div className="relative">
                                <Image
                                    src={isOnFriend ? PostIconGrey : PostIcon}
                                    alt="User Icon"
                                    className="w-[20px]"
                                />
                                {(noti.length != 0) &&
                                    <Image
                                        src={CircleDot}
                                        alt="Circle Dot"
                                        className="absolute w-[10px] top-[0px] -right-[4px]"
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 max-h-[400px] overflow-y-scroll com">
                        {isOnFriend && 
                            <>
                                {friendReqList.length == 0 ?
                                    <p className="text-sm text-center text-textGrayColor1">You don't have any requests !</p>
                                    :
                                    <div>
                                        {friendReqList.map((req: any, index: number) => {
                                            return <FriendReqCard key={index} user={req} setRefresh={setRefresh} ownerId={user.userId} />
                                        })}
                                    </div>
                                }
                            </>
                        }

                        {!isOnFriend &&
                            <>
                                {noti.length == 0 ?
                                    <p className="text-sm text-center text-textGrayColor1">You don't have any news !</p>
                                    :
                                    <div>
                                        {noti.map((no: any, index: number) => {
                                            return <CommentNotiCard key={index} setRenew={setRenew} id={no.notiId} message={no.message} image={no.image} commentId={no.commentId} postId={no.postId}/>
                                        })}
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>

                <div onClick={()=>router.push(`/account/${user.userId}`)} className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer">
                    <img 
                        src={user.avatar} 
                        alt="Avatar"
                        className="w-full h-full"
                    />
                </div>
            </div>
            {showMessage ? <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage} position="bottom-right" image={message.image} comment={message.comment}/> : <></>}
        </div>
    )
}