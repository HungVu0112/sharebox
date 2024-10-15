'use client'

import Image from "next/image";
import Logo from "../public/parachute-box-solid.svg";
import GlassIcon from "../public/magnifying-glass-solid.svg";
import ChatIcon from "../public/comment-solid.svg";
import PlusIcon from "../public/plus-solid-black.svg";
import NotifiIcon from "../public/bell-solid.svg";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ user } : { user: any }) {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>(""); 

    const handleChange = (e: any) => {
        setSearchText(e.target.value);
    }
    
    return (
        <div className="absolute top-0 left-0 flex justify-between items-center p-4 w-full h-[80px] border border-b-lineColor">
            <div className="ml-6 flex items-center gap-2 select-none">
                <Image 
                    src={Logo}
                    alt="Logo"
                    className="w-[35px]"
                />
                <p className="text-mainColor text-[20px] font-bold">Share Box</p>
            </div>

            <div className="flex items-center gap-4 p-4 w-[600px] h-[50px] bg-boxBackground rounded-full">
                <Image 
                    src={GlassIcon}
                    alt="Glass Icon"
                    className="w-[20px]"
                />
                <input type="text" value={searchText} onChange={handleChange} className="bg-transparent w-[500px] outline-none" placeholder="Search something..."/>
            </div>

            <div className="flex gap-10">
                <Image 
                    src={ChatIcon}
                    alt="Chat Icon"
                    className="w-[30px]"
                />

                <div onClick={() => { router.push("/createpost") }} className="flex gap-1 items-center hover:scale-[1.1] cursor-pointer">
                    <Image 
                        src={PlusIcon}
                        alt="Chat Icon"
                        className="w-[25px]"
                    />
                    <p className="font-bold text-lg">Create</p>
                </div>

                <Image 
                    src={NotifiIcon}
                    alt="Notifi Icon"
                    className="w-[25px]"
                />

                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <img 
                        src={user.avatar} 
                        alt="Avatar"
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    )
}