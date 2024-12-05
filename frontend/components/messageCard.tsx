import { SetStateAction } from "react";
import TrashIcon from "@/public/trash-solid.svg";
import EditIcon from "@/public/pen-to-square-solid-white.svg";
import Image from "next/image";
import axios from "axios";

export default function MessageCard({ mes, isSender, isFinal, handleClick, mediaList, setContent, setEdit, setReload } : { mes: any, isSender: boolean, isFinal?: boolean, handleClick: (e: any, index: number) => void, mediaList: any, setContent: (value: SetStateAction<string>) => void, setEdit: (value: SetStateAction<string>) => void, setReload: (value: SetStateAction<number>) => void}) {
    const handleDelete = async() => {
        await axios.post(
            `http://localhost:8080/authentication/message/delete/${mes.messageId}`
        )
        setReload(n=>n+1);
    }
    
    const handelEdit = () => {
        setContent(mes.content);
        setEdit(mes.messageId);
    }
    
    return (
        <div className="flex flex-col items-end mesCard">
            <div className={`w-[238px] ${!isFinal ? "mb-3 " : "mb-1"} flex gap-2 ${isSender && "justify-end"}`}>
                {!isSender && 
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                        <img src={mes.senderAvatar} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                }
                {isSender &&
                    <div className="flex items-center option gap-2">
                        <div onClick={handleDelete} className="w-[25px] h-[25px] rounded-full bg-textHeadingColor flex items-center justify-center hover:scale-[1.05] duration-150 cursor-pointer">
                            <Image 
                                src={TrashIcon}
                                alt="Delete Icon"
                                className="w-[10px]"
                            />
                        </div>
                        {mes.type == "TEXT" && 
                            <div onClick={handelEdit} className="w-[25px] h-[25px] rounded-full bg-textHeadingColor flex items-center justify-center hover:scale-[1.05] duration-150 cursor-pointer">
                                <Image 
                                    src={EditIcon}
                                    alt="Edit Icon"
                                    className="w-[10px]"
                                />
                            </div>
                        }
                    </div>
                }
                <div className={`max-w-[200px] rounded-2xl bg-textHeadingColor text-white break-words text-[12px] ${mes.type == "TEXT" ? "p-2" : "overflow-hidden"}`}>
                    {mes.type == "TEXT" && 
                        <p>{mes.content}</p>
                    }

                    {mes.type == "IMAGE" && 
                        <img onClick={(e)=>{
                            const mediaIndex = mediaList.findIndex((media: any) => media.messageId === mes.messageId);
                            handleClick(e, mediaIndex);
                        }}  src={mes.content} alt="image" className="w-full object-contain"/>
                    }

                    {mes.type == "VIDEO" && 
                        <video src={mes.content} controls className="w-full object-contain"></video>
                    }
                </div>
            </div>
            {(isFinal && isSender && mes.seen) &&
                <div className="w-[15px] h-[15px] rounded-full overflow-hidden mb-3">
                    <img src={mes.receiverAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
            }
        </div>
    )
}