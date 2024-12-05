'use client'

import MainLayout from "@/components/mainLayout";
import GlassIcon from "@/public/magnifying-glass-solid.svg";
import EditIcon from "@/public/pen-to-square-solid.svg";
import CloseIcon from "@/public/xmark-solid-black.svg";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CustomFeedIcon from "@/public/category.svg";
import Image from "next/image";
import PostCard from "@/components/postCard";

type CustomFeedPageProps = {
  params: {
    feedId: string;
  };
};

export default function CustomFeedPage({ params }: CustomFeedPageProps) {
    const { feedId } = params;
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const boxRef = useRef<HTMLDivElement>(null);
    const resBox = useRef<HTMLDivElement>(null);
    const [feed, setFeed] = useState<any>();
    const [owner, setOwner] = useState<any>();
    const [searchText, setSearchText] = useState<string>("");
    const [searchRes, setSearchRes] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [posts, setPosts] = useState<any[]>([]);

    const handleShowBox = () => {
        setSearchText("");
        boxRef.current?.classList.toggle("hidden");
    }

    const handleAddCom = async(comId: string) => {
        const res = await axios.post(
            `http://localhost:8080/authentication/custom-feed/add/${feedId}`,
            {
                communityIds: [Number(comId)]
            }
        )
        if (res.data.result) {
            setRefresh(n=>n+1);
            setSearchText("");
        }
    }

    const handleDeleteCom = async(comId: string) => {
        const res = await axios.post(
            `http://localhost:8080/authentication/custom-feed/remove/${feedId}`,
            {
                communityIds: [Number(comId)]
            }
        )
        if (res.data.result) {
            setRefresh(n=>n+1);
        }
    }

    useEffect(() => {
        const getFeed = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/custom-feed/${feedId}`
            )
            if (res.data.result) setFeed(res.data.result);
        }
        getFeed();
    },[refresh])

    useEffect(() => {
        if (feed && feed.ownerId != user.userId) {
            const getOwner = async() => {
                const res = await axios.get(
                    `http://localhost:8080/authentication/users/user/${feed?.ownerId}`
                )

                if (res.data.result) setOwner(res.data.result);
            }
            getOwner();
        }
        const getPosts = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/custom-feed/recent-posts/${feedId}`
            )
            if (res.data.result) setPosts(res.data.result);
        }
        getPosts();
    },[feed])
    
    useEffect(() => {
        if (searchText != "") {
            const getSearchRes = async() => {
                const res = await axios.post(
                    `http://localhost:8080/authentication/community/search`,
                    {
                        keyword: searchText
                    }
                )
                if (res.data.result) {
                    const filteredResults = res.data.result.filter(
                        (community: any) => 
                            !feed?.communities.some(
                                (existingCom: any) => existingCom.communityId === community.communityId
                            )
                    );
                    setSearchRes(filteredResults);
                }
            }
            getSearchRes()
        }
    }, [searchText])

    return (
        <MainLayout>
            <main className="w-full flex justify-center select-none">
                <title>{feed ? "Share Box": feed?.name}</title>
                <div className="w-[80%] mt-4">  
                    <div className="flex items-center gap-8 w-full p-8 rounded-xl bg-mainColor">
                        <Image 
                            src={CustomFeedIcon}
                            alt="Icon"
                            className="w-[100px]"
                        />
                        <div>
                            <h1 className="text-[24px] font-bold text-textHeadingColor">{feed?.name}</h1>
                            <div className="flex gap-1 text-white">
                                <p>Created by </p>
                                <p className="font-bold">{owner ? owner.username : user.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8 flex justify-between">
                        <div className="w-[70%]">
                            {feed?.communities.length == 0 ?
                                <div className="py-6 w-full flex flex-col items-center gap-3">
                                    <p className="font-bold text-textGrayColor1 text-xl">This feed doesn't have any communities yet</p>
                                    <button onClick={handleShowBox} className="w-[180px] h-[40px] text-white rounded-full bg-voteDownColor hover:scale-[1.05] duration-150">Add Communities</button>
                                </div> 
                                :
                                <div className="">
                                    {posts.map((post: any) => {
                                        return <PostCard key={post.postId} data={post} canNavigate isInCom={false}/>
                                    })}
                                </div>
                            }
                        </div>
                        <div className="sticky w-[28%] top-[100px] h-fit bg-boxBackground rounded-md p-4 text-textHeadingColor break-words">
                            <h3 className="text-lg font-bold">{owner ? owner.username : user.username}</h3>
                            <p className="text-sm font-semibold">{feed?.description}</p>
                            <div className="mt-4 w-full h-[1px] bg-lineColor"></div>
                            <div className="mt-4 w-full">
                                <div className="w-full flex justify-between items-center">
                                    <h3 className="font-bold text-lg">COMMUNITIES</h3>
                                    <Image 
                                        src={EditIcon}
                                        alt="Edit Icon"
                                        className="w-[15px] cursor-pointer hover:scale-[1.03] duration-150"
                                        onClick={handleShowBox}
                                    />
                                </div>
                                <div className="relative mt-2 flex items-center gap-4 p-4 w-full h-[40px] bg-white rounded-full">
                                    <Image 
                                        src={GlassIcon}
                                        alt="Glass Icon"
                                        className="w-[15px]"
                                    />
                                    <input type="text" value={boxRef.current?.classList.contains("hidden") ? searchText : ""} onChange={(e)=>setSearchText(e.target.value)} className="text-[14px] bg-transparent w-[80%] outline-none" placeholder="Search for communities..."/>
                                    {searchText != "" && boxRef.current?.classList.contains("hidden") && 
                                        <div className="absolute w-[200px] p-3 rounded-md top-[50px] left-[calc(50%-100px)] shadow-md z-[60] bg-white">
                                            <p className="font-bold text-sm">RESULTS</p>
                                            <div className="mt-2 max-h-[300px] overflow-y-scroll com">
                                                {searchRes.length != 0 ? searchRes.map((com: any, index: number) => {
                                                    return <div key={index} onClick={()=>handleAddCom(com.communityId)} className="w-full flex gap-3 items-center mb-2 p-2 hover:bg-boxBackground rounded-md cursor-pointer">
                                                                <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                                                                    <img src={com.avatar} alt="avatar" className="w-full h-full object-cover"/>
                                                                </div>
                                                                <p className="text-sm">{com.name}</p>
                                                            </div>
                                                })
                                                :
                                                <p className="text-sm text-textGrayColor1 font-semibold text-center">No communities found !</p>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="mt-4 px-2">
                                    {feed?.communities.map((com: any, index: number) => {
                                        return <div key={index} className="flex w-full gap-2 items-center mb-3">
                                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                                <img src={com.avatar} alt="Avartar" className="w-full h-full object-cover"/>
                                            </div>
                                            <div>
                                                <h3 className="text-textHeadingColor font-bold">{com.name}</h3>
                                                <p className="text-sm text-textGrayColor1">{com.members.length} members</p>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="mt-4 w-full h-[1px] bg-lineColor"></div>
                            <div className="mt-4 w-full">
                                <h3 className="font-bold text-lg">MODERATOR</h3>
                                <div className="mt-3 flex items-center">
                                <div className="w-[60px] h-[60px] rounded-full bg-textGrayColor1 overflow-hidden">
                                    <img src={owner ? owner.avatar : user.avatar} alt="Avatar" />
                                </div>
                                <p className="ml-4 font-bold">{owner ? owner.username : user.username}</p>
                                </div>
                            </div>
                        </div>
                        
                        
                        
                        
                        {/* Add Box */}
                        <div ref={boxRef} className="text-textHeadingColor flex items-center justify-center hidden fixed top-0 left-0 w-full h-[100vh] bg-transparentBlack z-[100] select-none">
                           <div className="relative w-[650px] rounded-lg bg-white p-6">
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-bold">COMMUNITIES</h1>
                                    <Image 
                                        src={CloseIcon}
                                        alt="Close Icon"
                                        className="w-[20px] hover:scale-[1.05] duration-150 cursor-pointer"
                                        onClick={handleShowBox}
                                    />
                                </div>

                                <div className="relative mt-6 flex items-center gap-4 p-4 w-full h-[40px] bg-boxBackground rounded-full">
                                    <Image 
                                        src={GlassIcon}
                                        alt="Glass Icon"
                                        className="w-[15px]"
                                    />
                                    <input type="text" value={searchText} onChange={(e)=>setSearchText(e.target.value)} className="text-[14px] bg-transparent w-[90%] outline-none" placeholder="Search for communities..."/>
                                    {searchText != "" && 
                                        <div ref={resBox} className="absolute w-[300px]  p-6 rounded-lg shadow-lg top-[50px] left-[calc(50%-150px)] bg-white z-[110] border border-lineColor">
                                            <p className="font-bold">RESULTS</p>
                                            <div className="mt-3 max-h-[300px] overflow-y-scroll com">
                                                {searchRes.length != 0 ? searchRes.map((com: any, index: number) => {
                                                    return <div key={index} onClick={()=>handleAddCom(com.communityId)} className="w-full flex gap-3 items-center mb-2 p-2 hover:bg-boxBackground rounded-md cursor-pointer">
                                                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                                                    <img src={com.avatar} alt="avatar" className="w-full h-full object-cover"/>
                                                                </div>
                                                                <p className="text">{com.name}</p>
                                                            </div>
                                                })
                                                :
                                                <p className="text-sm text-textGrayColor1 font-semibold text-center">No communities found !</p>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="w-full mt-8">
                                    {feed?.communities.map((com: any, index: number) => {
                                        return <div key={index} className="w-full flex justify-between items-center mb-4">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                                    <img src={com.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                                                </div>
                                                <p className="text-textHeadingColor font-bold">{com.name}</p>
                                            </div>
                                            <button onClick={()=>handleDeleteCom(com.communityId)} className="w-[100px] h-[40px] rounded-full hover:scale-[1.03] duration-150 bg-warningMessageBackground text-white">
                                                Delete
                                            </button>
                                        </div>
                                    })}
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </main>
        </MainLayout>
    )
}