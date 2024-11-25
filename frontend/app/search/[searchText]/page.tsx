'use client'

import CommunityCard from "@/components/communityCard";
import MainLayout from "@/components/mainLayout";
import PostCard from "@/components/postCard";
import axios from "axios";
import { useEffect, useState } from "react";

type SearchPageProps = {
    params: {
      searchText: string;
    };
  };

export default function SearchPage({ params }: SearchPageProps) {
    const { searchText } = params;
    const [searchRes, setSearchRes] = useState<any[]>([]);
    const [coms, setComs] = useState<any[]>([]);

    useEffect(() => {
        const getPosts = async() => {
            const res = await axios.post(
                "http://localhost:8080/authentication/post/search",
                {
                    keyword: searchText
                }
            )
            if (res.data.result) setSearchRes(res.data.result);
        }
        getPosts();

        const getComs = async() => {
            const res = await axios.post(
                "http://localhost:8080/authentication/community/search",
                {
                    keyword: searchText
                }
            )
            if (res.data.result) setComs(res.data.result);
        }
        getComs();
    }, [])

    return (
        <MainLayout>
            <main className="w-full select-none px-4">
                <title>{searchText}</title>
                <div className="flex justify-between w-full mt-4">
                    <div className="w-[70%]">
                        <h1 className="text-2xl font-bold text-textHeadingColor">Results for: "{searchText}"</h1>
                        {searchRes.length != 0 && <p className="mt-2 text-textGrayColor1 font-semibold">Found: {searchRes.length} posts</p>}
                        <div className="mt-6">
                            {searchRes.length == 0 ? 
                                <p className="text-lg font-semibold text-textGrayColor1">No posts found !</p>
                                :
                                <>  
                                    {searchRes.map((post: any, index: number) => {
                                        return <PostCard data={post} canNavigate isInCom={false}/>
                                    })}
                                </>
                            }
                        </div>
                    </div>
                    <div className="sticky top-[100px] right-0 w-[28%] h-fit rounded-lg p-4 border border-lineColor bg-white">
                        <h1 className="font-bold text-textHeadingColor">COMMUNITIES</h1>
                        <div className="mt-2">
                            {coms.length == 0 ?
                                <p className="text-sm text-textGrayColor1 font-semibold text-center">No communities found !</p>
                                :
                                <>
                                    {coms.map((com: any, index: number) => {
                                        return <CommunityCard key={index} community={com}/>
                                    })}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </MainLayout>
    )
}