import Image from "next/image";
import CheckIcon from "../public/check-solid-green.svg";
import LoadingIcon from "../public/spinner-solid-white.svg";
import WarningIcon from "../public/triangle-exclamation-solid.svg";
import CloseIcon from "../public/xmark-solid.svg";
import { SetStateAction } from "react";

export default function ToastMessage({type, message, redirect, setShowMessage} : 
    {type: string, message: string, redirect: boolean, setShowMessage: (value: SetStateAction<boolean>) => void}) 
{
    return (
        <div className={`flex gap-4 items-center absolute min-w-[300px] h-[90px] p-6 top-4 right-4 slider rounded-lg ${type == "success" ? "bg-onlineColor" : "bg-warningMessageBackground"}`}>
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
            <div className="">
                <p className="text-white font-medium">{message}</p>
                {redirect && 
                    <div className="mt-1 flex gap-2">
                        <p className="text-sm text-white">Redirect </p>
                        <Image
                            src={LoadingIcon}
                            alt="Loading Icon"
                            className="animate-spin w-[12px]"
                        />
                    </div>
                }
            </div>
            {redirect == false && 
                <Image 
                    src={CloseIcon}
                    alt="Close Icon"
                    onClick={() => setShowMessage(false)}
                    className="w-[20px] hover:scale-[1.1] duration-100 cursor-pointer"
                />
            }
        </div>
    )
}