'use client'

import Image from "next/image";
import Logo from "../public/parachute-box-solid.svg";
import GlassIcon from "../public/magnifying-glass-solid.svg";
import ChatIcon from "../public/comment-solid.svg";
import PlusIcon from "../public/plus-solid-black.svg";
import NotifiIcon from "../public/bell-solid.svg";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Header({ user } : { user: any }) {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>(""); 
    const [searchRes, setSearchRes] = useState<any[]>([]);

    const handleChange = (e: any) => {
        setSearchText(e.target.value);
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
    
    return (
        <div className="fixed bg-white z-[60] top-0 left-0 flex justify-between items-center p-4 w-full h-[80px] border border-b-lineColor">
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

            <div className="flex gap-10">
                <Image 
                    src={ChatIcon}
                    alt="Chat Icon"
                    className="w-[30px]"
                />

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

                <Image 
                    src={NotifiIcon}
                    alt="Notifi Icon"
                    className="w-[25px]"
                />

                <div onClick={()=>router.push(`/account/${user.userId}`)} className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer">
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