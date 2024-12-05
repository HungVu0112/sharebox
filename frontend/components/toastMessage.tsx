import Image from "next/image";
import CheckIcon from "../public/check-solid-green.svg";
import LoadingIcon from "../public/spinner-solid-white.svg";
import WarningIcon from "../public/triangle-exclamation-solid.svg";
import CloseIcon from "../public/xmark-solid.svg";
import CloseIconBlack from "@/public/xmark-solid-black.svg";
import ChatIcon from "@/public/comment-dots-solid.svg";
import { SetStateAction } from "react";

export default function ToastMessage({type, message, redirect, setShowMessage, position, image, comment} : 
    {type: string, message: string, redirect: boolean, setShowMessage: (value: SetStateAction<boolean>) => void, position: string, image?: string, comment?: string}) 
{
    return (
        <div className={`border border-slate-200 flex gap-4 items-center fixed z-[70] min-w-[300px] h-[90px] p-6 ${position == "top-right" ? "top-4 right-4" : "bottom-4 right-4"} slider rounded-lg shadow-xl ${type == "success" ? "bg-onlineColor" : type == "warning" ? "bg-warningMessageBackground" : "bg-white"}`}>
            {type == "success" && 
                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white">
                    <Image 
                        src={CheckIcon}
                        alt="Check Icon"
                        className="w-[20px] select-none"
                    />
                </div>
            }
            {type == "warning" && 
                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white">
                    <Image 
                        src={WarningIcon}
                        alt="Warning Icon"
                        className="w-[20px] select-none"
                    />
                </div>
            }
            {type == "noti" &&
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-md">
                    <img src={image} alt="Image" className="w-full h-full object-cover"/>
                </div>
            }
            <div className={`${type == "noti" ? "text-textHeadingColor" : "text-white"}`}>
                <p className="font-medium">{message}</p>
                {redirect && 
                    <div className="mt-1 flex gap-2">
                        <p className="text-sm">Redirect </p>
                        <Image
                            src={LoadingIcon}
                            alt="Loading Icon"
                            className="animate-spin w-[12px]"
                        />
                    </div>
                }
                {comment && 
                    <div className="mt-1 flex gap-2 w-[200px]">
                        <Image
                            src={ChatIcon}
                            alt="Chat Icon"
                            className="w-[12px]"
                        />
                        <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-textGrayColor1">{comment}</p>
                    </div>
                }
            </div>
            {redirect == false &&
                <>
                    {type == "noti" ? 
                        <Image 
                            src={CloseIconBlack}
                            alt="Close Icon Black"
                            onClick={() => setShowMessage(false)}
                            className="w-[20px] hover:scale-[1.1] duration-100 cursor-pointer"
                        />
                        :
                        <Image 
                            src={CloseIcon}
                            alt="Close Icon"
                            onClick={() => setShowMessage(false)}
                            className="w-[20px] hover:scale-[1.1] duration-100 cursor-pointer"
                        />    
                    }
                </> 
            }
        </div>
    )
}