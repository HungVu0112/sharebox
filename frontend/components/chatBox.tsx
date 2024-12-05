import { useSelectedRoomContext } from "@/context/SelectedRoomContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@/public/xmark-solid.svg";
import MediaIcon from "@/public/camera-solid-white.svg";
import Minus from "@/public/minus-solid.svg";
import Arrow from "@/public/angle-up-solid-white.svg";
import Plane from "@/public/paper-plane-solid-white.svg";
import Image from "next/image";
import MessageCard from "./messageCard";
import websocketService from "@/websoket/websocket-service";
import LoadingIcon from "@/public/spinner-solid-white.svg";
import { useChatroomListContext } from "@/context/ChatroomListContext";

export default function ChatBox() {
    const { chatroomList, setChatroomList } = useChatroomListContext();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const { selectedRoom, setSelectedRoom } = useSelectedRoomContext();
    const [mesList, setMesList] = useState<any[]>([]);
    const [mediaList, setMediaList] = useState<any[]>([]);
    const [friend, setFriend] = useState<any>();
    const [content, setContent] = useState<string>("");
    const [reload, setReload] = useState<number>(0);   
    const [imgIndex, setImgIndex] = useState<number>(0);
    const imageSlide = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<string>("");
    const [fileArr, setFileArr] = useState<{
        file: File,
        url: string,
        type: string       
    }[]>([]);

    const handleUpMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        if (!files) return;

        let previewFileArr : {
            file: File,
            url: string,
            type: string
        }[] = [...fileArr];

        Array.from(files).forEach((file : File) => {
            const url = file && URL.createObjectURL(file);
            const isImage = file.type.startsWith('image/');
            const save = {
                file: file,
                url: url,
                type: isImage ? "IMAGE" : "VIDEO"
            }
            previewFileArr.push(save);
        });

        setFileArr(previewFileArr);
    }

    const deleteMedia = (url: string) => {
        const newFileArr = fileArr.filter(fileObj => fileObj.url !== url);
        setFileArr(newFileArr);
    }

    const handleClose = async() => {
        await axios.post(
            `http://localhost:8080/authentication/chatroom/change-status?chatroomId=${selectedRoom.chatroomId}&userId=${user.userId}&status=LEAVE`
        )
        setSelectedRoom(null);
    }

    const handleSendMes = async() => {
        try {
            if (isEdit != "") {
                const formData = new FormData();
                formData.append("content", content);
                formData.append("type", "TEXT");
                await axios.post(
                    `http://localhost:8080/authentication/message/edit/${isEdit}`,
                    formData
                )
                setIsEdit("");
                setContent("");
                setReload(n=>n+1);
            } else {
                if (fileArr.length > 0) {
                    setIsUploading(true);
                    const uploadPromises = fileArr.map(async (file_) => {
                        const formData = new FormData();
                        formData.append("content", file_.file);
                        formData.append("type", file_.type);
                        
                        await axios.post(
                            `http://localhost:8080/authentication/message/create-media/${selectedRoom?.chatroomId}/${user.userId}/${friend?.userId}`,
                            formData
                        );
                    });
        
                    await Promise.all(uploadPromises);
                }
    
                if (content !== "") {
                    const formData = new FormData();
                    formData.append("content", content);
                    formData.append("type", "TEXT");
                    
                    const res = await axios.post(
                        `http://localhost:8080/authentication/message/create/${selectedRoom?.chatroomId}/${user.userId}/${friend?.userId}`,
                        formData
                    );
        
                    if (res.data.result) {
                        setContent("");
                        setFileArr([]);
                    }
                }
        
                setReload(prev => prev + 1);
                setIsUploading(false);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setIsUploading(false);
        }
    }

    const handlePrevImg = () => {
        setImgIndex(n => (n-1));
    }

    const handleNextImg = () => {
        setImgIndex(n => (n+1));
    }

    const handleMinimize = async() => {
        const newChatroom = chatroomList.filter((obj: any) => JSON.stringify(obj) !== JSON.stringify(selectedRoom));
        newChatroom.push(selectedRoom);
        setChatroomList(newChatroom);
        await axios.post(
            `http://localhost:8080/authentication/chatroom/change-status?chatroomId=${selectedRoom.chatroomId}&userId=${user.userId}&status=LEAVE`
        )
        setSelectedRoom(null);
    }

    const handleKeyDown = (e: any) => {
        if (e.key == "ArrowLeft" && imgIndex > 0) handlePrevImg();
        if (e.key == "ArrowRight" && imgIndex < (mediaList.length - 1)) handleNextImg();
        if (e.key == "Escape") {
            imageSlide.current?.classList.toggle("hidden");
            setImgIndex(0);
        }
    }

    const handleClick = (e: any, index: number) => {
        e.stopPropagation();
        imageSlide.current?.classList.toggle("hidden");
        setImgIndex(index);
        imageSlide.current?.focus();
    }

    useEffect(() => {
        if (selectedRoom) {
            setContent("");
            setFileArr([]);
            const checkFr = user.userId == selectedRoom.user1Id;
            const fr = {
                userId: checkFr ? selectedRoom.user2Id : selectedRoom.user1Id,
                username: checkFr ? selectedRoom.user2_username : selectedRoom.user1_username,
                avatar: checkFr ? selectedRoom.user2_avatar : selectedRoom.user1_avatar,
            }

            const getMesList = async() => {
                try {
                    const res = await axios.get(
                        `http://localhost:8080/authentication/message/get/${selectedRoom.chatroomId}`
                    );
                    if (res.data.result) {
                        const ml = [...res.data.result];
                        setMediaList(ml.filter(mes => mes.type !== "TEXT"));
                        setMesList(res.data.result);
                    }
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            };
            getMesList();

            const getFriendInfo = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/users/user/${fr.userId}`
                )
                if (res.data.result) {
                    setFriend({
                        ...fr,
                        online: res.data.result.online
                    })
                }
            }
            getFriendInfo();
        }
    }, [reload, selectedRoom]); 

    useEffect(() => {
        if (mesList.length > 0) {
            if (messagesEndRef) {
                messagesEndRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
            }
        }
    }, [mesList.length, selectedRoom, reload]);

    useEffect(() => {
        if (selectedRoom) {
            websocketService.subscribe(`/topic/message/change/${selectedRoom.chatroomId}/${user.userId}`, mes => {
                setReload(n=>n+1);
            })

            return () => {
                websocketService.unsubscribe(`/topic/message/change/${selectedRoom.chatroomId}/${user.userId}`)
            }
        }
    }, [selectedRoom])
    

    if (!selectedRoom) {
        return null;
    }
    
    return (
        <>
            <div className="fixed w-[350px] h-[450px] border border-slate-200 shadow-xl bg-white rounded-tl-lg rounded-tr-lg bottom-0 right-[100px] z-[100] overflow-hidden select-none">
                <div className="relative w-full h-[70px] py-2 px-3 bg-textHeadingColor flex items-center">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                        <img src={friend?.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div className="ml-2 text-white">
                        <h3 className="font-bold text-sm">{friend?.username}</h3>
                        <p className="text-[10px] text-textGrayColor1">{!friend?.online ? "Offline" : "Online"}</p>
                    </div>
                    <div className="absolute w-[38px] gap-2 h-full flex items-center top-0 right-3">
                        <Image
                            src={Minus}
                            alt="Minus"
                            className="w-[15px] hover:scale-[1.05] duration-150 cursor-pointer"
                            onClick={handleMinimize}
                        />
                        <Image 
                            src={CloseIcon}
                            alt="Close"
                            className="w-[15px] hover:scale-[1.05] duration-150 cursor-pointer"
                            onClick={handleClose}
                        />
                    </div>
                </div>
                
                <div className="w-full h-[320px] overflow-y-scroll com">
                    <div className="w-full h-[120px] flex flex-col gap-2 items-center justify-center">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                            <img src={friend?.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        <p className="text-textHeadingColor font-bold">{friend?.username}</p>
                    </div>
                    <div className="w-full px-3">
                        {mesList.map((mes: any, index: number) => {
                            return <div id={`idmes${index}`} key={mes.messageId} className={`flex w-full ${user.userId == mes.senderId ? "justify-end" : "justify-start"}`}>
                                <MessageCard setReload={setReload} setContent={setContent} setEdit={setIsEdit} mediaList={mediaList} isSender={user.userId == mes.senderId ? true : false} mes={mes} isFinal={index == (mesList.length - 1) && true} handleClick={handleClick}/>
                            </div>
                        })}
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                <div className="w-full h-[60px] bg-textHeadingColor flex p-3 justify-between items-center">
                    <label htmlFor="media">
                        <Image
                            src={MediaIcon}
                            alt="Media Icon"
                            className="w-[20px] hover:scale-[1.05] duration-150 cursor-pointer"
                        />
                        <input type="file" id="media" onChange={handleUpMedia} className="hidden" accept="image/png, image/jpeg, video/*"/>
                    </label>
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} className="w-[80%] h-[30px] rounded-full bg-white py-2 px-3 text-sm outline-none" placeholder="Type something ..." />
                    {isUploading ?
                        <Image
                            src={LoadingIcon}
                            alt="Loading Icon"
                            className="w-[20px] animate-spin"
                        />
                        :
                        <Image
                            src={Plane}
                            alt="Plane Icon"
                            className="w-[20px] hover:scale-[1.05] duration-150 cursor-pointer"
                            onClick={handleSendMes}
                        />    
                    }
                </div>

                {fileArr.length != 0 && 
                    <div className="absolute bottom-[58px] w-full h-[100px] bg-transparentBlack items-center p-3 overflow-x-scroll custom-scrollbar flex gap-5">
                        {fileArr.map((file_: any) => {
                            if (file_.type == "IMAGE") {
                                return <div key={file_.url} className="relative flex-shrink-0 w-[120px]">
                                    <img src={file_.url} alt="Image" className="w-full object-contain rounded-md border border-slate-200"/>
                                    <div onClick={()=>{deleteMedia(file_.url)}} className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] flex items-center justify-center bg-warningColor z-[110] rounded-full cursor-pointer hover:scale-[1.03] duration-150">
                                        <Image 
                                            src={CloseIcon}
                                            alt="CLose Icon"
                                            className="w-[10px]"
                                        />
                                    </div>
                                </div>
                            } else if (file_.type == "VIDEO") {
                                return <div key={file_.url} className="relative flex-shrink-0 w-[120px]">
                                    <video src={file_.url} controls className="w-full object-contain rounded-md border border-slate-200"></video>
                                    <div onClick={()=>{deleteMedia(file_.url)}} className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] flex items-center justify-center bg-warningColor z-[110] rounded-full cursor-pointer hover:scale-[1.03] duration-150">
                                        <Image 
                                            src={CloseIcon}
                                            alt="CLose Icon"
                                            className="w-[10px]"
                                        />
                                    </div>
                                </div>
                            } else {
                                return <></>
                            }
                        })}
                    </div>
                }
            </div>
            
            <div onKeyDown={handleKeyDown} tabIndex={0} ref={imageSlide} className="fixed hidden top-0 left-0 w-full h-[100vh] bg-transparentBlack z-[100] select-none">
                <Image 
                    src={CloseIcon}                
                    alt="Close Icon"
                    className="absolute top-8 left-8 w-[35px] hover:scale-[1.05] cursor-pointer z-50"
                    onClick={(e)=>handleClick(e, imgIndex)}
                />
                <div className="relative w-full h-[90%] flex items-center justify-center">
                    {imgIndex > 0 && 
                        <Image 
                            src={Arrow}
                            onClick={handlePrevImg}
                            alt="Prev Icon"
                            className="absolute top-[50%] left-4 w-[40px] -rotate-90 hover:scale-[1.05] cursor-pointer"
                        />
                    }
                    {mediaList.length > 0 && mediaList[imgIndex]?.type == "VIDEO" ? 
                        <video src={mediaList[imgIndex]?.content} controls className="mt-4 max-w-[80%] max-h-[80%] object-contain" /> :
                        <img src={mediaList[imgIndex]?.content} alt="Image" className="mt-4 max-w-[80%] max-h-[80%] object-contain"/>
                    }
                    {imgIndex < (mediaList.length - 1) && 
                        <Image 
                            src={Arrow}
                            onClick={handleNextImg}
                            alt="Next Icon"
                            className="absolute top-[50%] right-4 w-[40px] rotate-90 hover:scale-[1.05] cursor-pointer"
                        />
                    }
                </div>
                <div className="w-full h-[10%] py-4 flex gap-6 items-center justify-center">
                    {mediaList.map((media: any, index: number) => {
                        if (media.type == "VIDEO") {
                            return <video key={index} src={media.content} className={`rounded-2xl max-h-[60%] object-contain transition-transform duration-200 ${imgIndex == index ? "border-[3px] border-white" : "opacity-60"} ${mediaList.length > 0 && imgIndex == index && "scale-[1.2]"}`}/>
                        } else {
                            return <img key={index} src={media.content} alt="Image" className={`rounded-2xl max-h-[60%] object-contain transition-transform duration-200 ${imgIndex == index ? "border-[3px] border-white" : "opacity-60"} ${mediaList.length > 0 && imgIndex == index && "scale-[1.2]"}`}/>
                        }
                    })}
                </div>
            </div>
        </>
    );
}